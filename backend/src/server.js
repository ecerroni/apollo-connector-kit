// TODO: ADD GRAPHQL TESTER (WITH AUTH SKIP FOR TESTING)

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { SERVER } from '~/config';
import { schema } from '~/schema';
import { handleAuthentication } from '~/authentication';
import enableCors from '~/cors';
import {
  context as buildContext,
  formatResponse,
  formatError,
  formatParams,
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
  // formatResponse: ({ req, res, context }) => formatResponse(res, { context }, res, req),
  formatError: err => formatError(err),
  formatParams: params => formatParams(params),
  formatResponse: (response, query) => formatResponse({ response, query }),
});
server.applyMiddleware({ app });

const { PORT } = SERVER;
app.listen({ port: PORT }, () => {
  startupMessages({ port: PORT });
});
