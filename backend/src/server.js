/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import {
  SERVER,
  DEPTH_LIMIT as QUERY_DEPTH_LIMIT,
  MAX_COST as QUERY_MAX_COST,
} from '~/config';
import { schema } from '~/schema';
import { handleAuthentication } from '~/authentication';
import enableCors from '~/cors';
import {
  context as buildContext,
  formatResponse,
  formatError,
} from '~/graphql';
// import { Branch, Profession } from './datasources';
import { startupMessages, RESPONSE } from '~/environment';

const app = express();

app.get('/', (req, res) => {
  res.writeHead(200, { Connection: 'close' });
  res.end(RESPONSE.MESSAGES.UP_RUNNING);
});


app.use(handleAuthentication);

// Error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const { status } = err;
  res.status(status).json(err);
};
app.use(errorHandler);

app.use(express.json({ limit: SERVER.PAYLOAD.JSON.LIMIT }));
app.use(express.urlencoded({
  limit: SERVER.PAYLOAD.URL_ENCODED.LIMIT,
  parameterLimit: SERVER.PAYLOAD.URL_ENCODED.PARAMTER_LIMIT,
  extended: true,
}));

const server = new ApolloServer({
  schema,
  path: SERVER.GRAPHQL,
  cors: enableCors(),
  dataSources: () => ({
  //   dbBranches: new Branch(),
  //   dbProfessions: new Profession(),
  }),
  context: ({ res, req }) => buildContext({ res, req }),
  validationRules: [
    depthLimit(QUERY_DEPTH_LIMIT,
      // { ignore: [ /_trusted$/, 'idontcare' ] },
      // depths => console.log(depths)
    ),
    // ref: https://github.com/pa-bru/graphql-cost-analysis
    costAnalysis({
      maximumCost: QUERY_MAX_COST,
    }),
  ],
  formatError: err => formatError(err),
  formatResponse: (response, query) => formatResponse({ response, query }),
});
server.applyMiddleware({ app });

const { PORT } = SERVER;
app.listen({ port: PORT }, () => {
  startupMessages({ port: PORT });
});
