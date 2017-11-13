import { graphiqlExpress } from 'apollo-server-express';
import { AUTH, SERVER } from '@/config'

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
