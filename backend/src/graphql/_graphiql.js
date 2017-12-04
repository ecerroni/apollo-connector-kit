import { graphiqlExpress } from 'apollo-server-express';
import { AUTH, SERVER } from '@/config';

// If using GraphiQL put the token in the request headers
// This Chrome extension is a good fit for the task: https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj
// you need to add 2 headers:
// - x-connector-token
// - x-connector-auth-request-type

let graphiqlQueries = '';
if (process.env.NODE_ENV !== 'production') {
  graphiqlQueries = `
      query test {
        publicTest
      }
  
      query auth {
        checkAuth
      }
  
      mutation validToken {
        createValidToken(secret: "${AUTH.SECRET_TOKEN}")
      }
  
      mutation notValidToken {
        createExpiredToken(secret: "${AUTH.SECRET_TOKEN}")
      }
    `;
}

// Graphiql + some initial queries
export default {
  path: SERVER.GRAPHIQL,
  server: graphiqlExpress({
    endpointURL: SERVER.GRAPHQL,
    query: graphiqlQueries,
  }),
};
