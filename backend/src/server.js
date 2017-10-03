import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { OperationStore } from 'graphql-server-module-operation-store';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import { server, auth, database, whitelistedQueries } from './config';
import { schema } from './schema';
import { context, localAuth } from './utils';
import { mockUsers } from './mocks';
import { whitelistedOperations } from './whitelist';
import { UNAUTHORIZED } from './environment';

const PORT = server.port;
const expressServer = express();
const localAuthServer = localAuth() && auth.strategies.httpOnly;

if (typeof auth.secret === 'undefined') {
  console.warn('WARNING: process.env.AUTH_SECRET is not defined. Check README.md for more information');
} else {
  console.log('AUTH SECRET HAS BEEN PROVIDED')
  if (typeof auth.endpoint === 'undefined') {
    console.warn('WARNING: process.env.AUTH_ENDPOINT is not defined. Check README.md for more information');
  } else {
    console.log(`AUTH ENDPOINT = ${auth.endpoint}`)
    const authLocation = localAuth() ? 'THIS ONE' : 'EXTERNAL';
    console.log(`AUTH SERVER IS ${authLocation}`);
    console.log('ALL SET >> SERVER CONFIGURATION READY');
  }
}

// FIXES EIHER CORS ERROR OR APOLLO SERVER METHOD NOT ALLOWED (405) WHEN F-E WEBPACK DEV SERVER
// (i.e. VUE) HAS NO PROXY TABLE FOR APOLLO /GRAPHQL
const whitelist = [
  // Allow domains here
  'http://localhost:8080',
];
const corsOptions = {
  origin(origin, callback){
    const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true,
};
expressServer.use(cors(corsOptions));


// LOGOUT THROUGH POST METHOD AND INVALIDATING HTTP_ONLY COOKIE
if (localAuthServer) {
  expressServer.post('/handle-logout', bodyParser.urlencoded({
    extended: true,
  }), (req, res, next) => {
    res.cookie(auth.cookie.name, '', { expires: new Date(0), httpOnly: true }).sendStatus(200)
    next;
  });
}

// AUTHENTICATION THROUGH POST METHOD AND SETTING HTTP_ONLY COOKIE
if (localAuthServer) {
  expressServer.post('/handle-login', bodyParser.urlencoded({
    extended: true,
  }), (req, res, next) => {
    const users = mockUsers;
    const user = req && req.body && users.filter(u => u.username === req.body.username).length > 0 ? users.filter(u => u.username === req.body.username)[0] : '';
    const additionalClaims = {};
    if (req.headers.uuid) {
      // TODO: THIS SHOULD BE EITHER HASHED OR ENCRYPTED OR THE JWT PAYLOAD SHOULD.
      additionalClaims.jwtid = req.headers.uuid;
    }
    if (req.headers.fingerprint) {
      additionalClaims.subject = req.headers.fingerprint; // TODO: SAME AS ABOVE
    }

    if (!user) {
      res.status(403).send('Invalid User');
    } else {
        // check if password and username matches
      if (user.username !== req.body.username || user.password !== req.body.password) {
        res.status(403).send('Invalid Password');
      } else {
        // if user is found and password is right
        // create a token
        const token = jwt.sign({ id: user.id }, auth.secret);
        // return the information including token as JSON
        // set token to cookie using the httpOnly flag
        res.cookie(auth.cookie.name, token, { expiresIn: '1h', ...additionalClaims, httpOnly: true }).sendStatus(200)
        // We could also try to make the following work against a different scenario
        /*
          res.cookie(auth.cookie.name, token, {
            expires: new Date(Number(new Date()) + 1000000), httpOnly: true,
          }).status(301).redirect('/');
        */
        next;
      }
    }
  });
}

let store;
if (whitelistedQueries) {
  store = new OperationStore(schema);
  whitelistedOperations.forEach(op => store.put(op));
}

expressServer.use(server.graphql, bodyParser.json(), graphqlExpress(async (request, response) => {

  // console.log(request.body);
  const graphqlObj = {
    schema,
    context: await context(request.headers, process.env),
    formatError: (err) => {
      if (err.message === UNAUTHORIZED) {
        // We need this response status in the apollo client afterware
        response.status(401);
        return err;
      }
      return err;
    },
    formatParams(params) {
      if (whitelistedQueries) {
        params['query'] = store.get(params.operationName);
        if (!params['query']){
          throw new Error(`Only whitelisted queries are allowed. No query stored for ${params.operationName}`);
        }
      }
      return params;
    },
  };
  return graphqlObj;
}));

// Graphiql + some initial queries
expressServer.use(server.graphiql, graphiqlExpress({
  endpointURL: server.graphql,
  query: `
    query test {
      test
    }
    query user {
      currentUser {
        id
        email
      }
    }

    query auth {
      checkAuth
    }

    query validToken {
      createValidToken(secret: "${auth.secret}")
    }

    query notValidToken {
      createExpiredToken(secret: "${auth.secret}")
    }
    `,
}));

expressServer.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
  console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);
});
