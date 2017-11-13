// TODO: ADD GRAPHQL TESTER (WITH AUTH SKIP FOR TESTING)

import express from 'express';
import { graphqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { SERVER, AUTH, JWT } from '@/config';
import { schema } from '@/schema';
import { handleAuthentication } from '@/authentication';
import enableCors from '@/cors';
import {
  context as buildContext,
  formatResponse,
  formatError,
  formatParams,
  graphiql,
} from '@/graphql';
import { startupMessages, RESPONSE } from '@/environment';

const expressServer = express();

expressServer.use(enableCors());


expressServer.get('/', (req, res) => {
  res.writeHead(200, { Connection: 'close' });
  res.end(RESPONSE.MESSAGES.UP_RUNNING);
});


expressServer.use(handleAuthentication);

expressServer.use(SERVER.GRAPHQL, bodyParser.json(), graphqlExpress(async (request, response) => ({
  schema,
  context: await buildContext(request),
  formatResponse: (res, { context }) => formatResponse(res, { context }, response, request),
  formatError: err => formatError(err, response),
  formatParams: params => formatParams(params),
})));

// Graphiql + some initial queries
expressServer.use(graphiql.path, graphiql.server);


const { PORT } = SERVER;
expressServer.listen(PORT, () => {
  startupMessages();
});
