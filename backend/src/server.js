// TODO: ADD GRAPHQL TESTER (WITH AUTH SKIP FOR TESTING)

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { SERVER, DEPTH_LIMIT as QUERY_DEPTH_LIMIT } from '~/config';
import { schema } from '~/schema';
import { handleAuthentication } from '~/authentication';
import enableCors from '~/cors';
import {
  context as buildContext,
  formatResponse,
  formatError,
} from '~/graphql';
import { startupMessages, RESPONSE } from '~/environment';

const app = express();

// app.use(enableCors());


app.get('/', (req, res) => {
  res.writeHead(200, { Connection: 'close' });
  res.end(RESPONSE.MESSAGES.UP_RUNNING);
});


app.use(handleAuthentication);

const server = new ApolloServer({
  schema,
  path: SERVER.GRAPHQL,
  cors: enableCors(),
  context: ({ res, req }) => buildContext({ res, req }),
  validationRules: [
    depthLimit(QUERY_DEPTH_LIMIT,
      // { ignore: [ /_trusted$/, 'idontcare' ] },
      // depths => console.log(depths)
    ),
  ],
  formatError: err => formatError(err),
  formatResponse: (response, query) => formatResponse({ response, query }),
});
server.applyMiddleware({ app });

const { PORT } = SERVER;
app.listen({ port: PORT }, () => {
  startupMessages({ port: PORT });
});
