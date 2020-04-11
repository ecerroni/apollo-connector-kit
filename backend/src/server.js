/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import {
  SERVER,
  DEPTH_LIMIT as QUERY_DEPTH_LIMIT,
  MAX_COST as QUERY_MAX_COST
} from '~/config';
import { schema } from '~/schema';
import { handleAuthentication } from '~/authentication';
import enableCors from '~/cors';
import {
  context as buildContext,
  formatResponse,
  formatError
} from '~/graphql';
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
  return res.status(status).json(err);
};
app.use(errorHandler);

app.use(express.json({ limit: SERVER.PAYLOAD.JSON.LIMIT }));
app.use(
  express.urlencoded({
    limit: SERVER.PAYLOAD.URL_ENCODED.LIMIT,
    parameterLimit: SERVER.PAYLOAD.URL_ENCODED.PARAMTER_LIMIT,
    extended: true
  })
);

// TODO: remove this hack when the following issue is solved
// https://github.com/pa-bru/graphql-cost-analysis/issues/12
class CostAnalysisApolloServer extends ApolloServer {
  async createGraphQLServerOptions(req, res) {
    const options = await super.createGraphQLServerOptions(req, res);

    options.validationRules = options.validationRules
      ? options.validationRules.slice()
      : [];
    options.validationRules.push(
      costAnalysis({
        variables: req.body.variables,
        maximumCost: QUERY_MAX_COST,
        defaultCost: 1,
        ...(process.env.NODE_ENV !== 'production' && {
          onComplete: costs =>
            console.log(`Query costs: ${costs} (max: ${QUERY_MAX_COST})`)
        })
      })
    );

    return options;
  }
}
const server = new CostAnalysisApolloServer({
  schema,
  path: SERVER.GRAPHQL,
  cors: enableCors(),
  context: ({ res, req }) => buildContext({ res, req }),
  validationRules: [
    depthLimit(
      QUERY_DEPTH_LIMIT
      // { ignore: [ /_trusted$/, 'idontcare' ] },
      // depths => console.log(depths)
    )
    // ref: https://github.com/pa-bru/graphql-cost-analysis
    // TODO: get this back when the follwing issue is solved
    // https://github.com/pa-bru/graphql-cost-analysis/issues/12
    // costAnalysis({
    //   maximumCost: QUERY_MAX_COST,
    // }),
  ],
  formatError: err => formatError(err),
  formatResponse: (response, query) => formatResponse({ response, query })
});
server.applyMiddleware({ app });

const { PORT } = SERVER;
app.listen({ port: PORT }, () => {
  startupMessages({ port: PORT });
});
