import { AUTH, SERVER } from '~/config';

const { PORT } = SERVER;

const localAuthCheck = () => AUTH.ENDPOINT === 'localhost' || AUTH.ENDPOINT === '127.0.0.1' || AUTH.ENDPOINT === '0.0.0.0';

export const startupMessages = ({ port }) => {
  if (typeof AUTH.SECRET_TOKEN === 'undefined' || typeof AUTH.SECRET_REFRESH_TOKEN === 'undefined') {
    console.warn(`WARNING: NOT ALL ENV SECRETS HAVE BEEN PROVIDED. Check README.md
      for more information`);
  } else {
    console.log('AUTH SECRETS HAVE BEEN PROVIDED');
    if (typeof AUTH.ENDPOINT === 'undefined') {
      console.warn('WARNING: process.env.AUTH_ENDPOINT is not defined. Check README.md for more information');
    } else {
      console.log(`AUTH ENDPOINT = ${AUTH.ENDPOINT}`);
      const authLocation = localAuthCheck() ? 'THIS ONE' : 'EXTERNAL';
      console.log(`AUTH SERVER IS ${authLocation}`);
      console.log('ALL SET >> SERVER CONFIGURATION READY');
    }
  }
  console.log(`🚀  GraphQL Server is now running on http://localhost:${port}/graphql 🚀`);
  console.log(`View GraphiQL at http://localhost:${port}/graphiql`);
}
