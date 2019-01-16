import fetch from 'isomorphic-unfetch'
import { ApolloClient } from 'apollo-client'
import { withClientState } from 'apollo-link-state'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import decode from 'jwt-decode'
import Router from 'next/router'
import QUERIES from '../../settings/queries.json';
import { APP, AUTH, CLIENT_AUTH_REQUEST_TYPE, CLIENT_AUTHENTICATION_METHOD, JWT, VERSION, } from '../environment'
import { defaults, resolvers } from '../api'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch  
}
const {
  CONSTANTS: {
    UNAUTHORIZED,
    FORBIDDEN,
  } = {},
} = APP;

const login = QUERIES.LOGIN_RESOLVERS;
const logout = QUERIES.LOGOUT_RESOLVERS;

const opts = {
  credentials: 'same-origin',
  headers: {
    'frontend-version': VERSION,
    [AUTH.STRATEGIES.CLIENT.AUTH_HEADER]: CLIENT_AUTH_REQUEST_TYPE,
  },
};

const useLocalStorage = CLIENT_AUTHENTICATION_METHOD.LOCAL_STORAGE;

const apolloCache = new InMemoryCache({
  dataIdFromObject: e => `${e.__typename}_${e.id}` || null, // eslint-disable-line no-underscore-dangle
});

// const watchedMutationLink = new WatchedMutationLink(apolloCache, watchedMutations);
const stateLink = withClientState({
  cache: apolloCache,
  defaults,
  resolvers,
});
const httpLink = new HttpLink({
  uri: `${process.env.SERVER_URI}${APP.ENDPOINT.GRAPHQL}`,
  ...opts,
});
const authMiddlewareLink = setContext(() => {
  let headers = {};
  
  if (process.browser) {
    headers = {
      headers: {
        [JWT.HEADER.TOKEN.NAME]:
          localStorage.getItem(JWT.LOCAL_STORAGE.TOKEN.NAME) || null,
        [JWT.HEADER.REFRESH_TOKEN.NAME]: localStorage.getItem(JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME) || null, // eslint-disable-line
      },
    };
    if (headers.headers[JWT.HEADER.REFRESH_TOKEN.NAME]) {
      const currentTime = Date.now().valueOf() / 1000;
      const tokenExpiration = decode(
        headers.headers[JWT.HEADER.REFRESH_TOKEN.NAME],
      ).exp;
      if (currentTime > tokenExpiration) {
        Router.push('/login');
      }
    }
  }
  return headers;
});

const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map(response => {
    const operationName = response.data && Object.keys(response.data)[0];
    const context = operation.getContext();
    const { response: { headers } } = context;
    // if (!useLocalStorage && login.includes(operationName)) {
    //   const { token, refreshToken} = JSON.parse(response.data[operationName]);    
    //   if (token) {
    //     // cookie.set(JWT.COOKIE.TOKEN.NAME, token, JWT.COOKIE.TYPE);
    //   }

    //   if (refreshToken) {        
    //     // cookie.set(JWT.COOKIE.REFRESH_TOKEN.NAME, refreshToken, JWT.COOKIE.TYPE);
    //   }
    //   return response;
    // }
    if (process.browser && operationName && login.includes(operationName)) {
      const { token, refreshToken} = JSON.parse(response.data[operationName]);
      // const token = headers.get(JWT.HEADER.TOKEN.NAME);
      // const refreshToken = headers.get(JWT.HEADER.REFRESH_TOKEN.NAME);
      if (token) {
        localStorage.setItem(JWT.LOCAL_STORAGE.TOKEN.NAME, token);
      }

      if (refreshToken) {
        localStorage.setItem(
          JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME,
          refreshToken,
        );
      }
    }
    return response;
  }),
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors && graphQLErrors.filter(e => e).length > 0)
    graphQLErrors.map(({ message = '', status = 200 }) => {
      if (UNAUTHORIZED === message || status === 401) {
        console.warn(`You've attempted to access ${UNAUTHORIZED} section`);
        if (
          Router &&
          Router.router &&
          Router.router.pathname !== '/login'
        ) {
          Router.push('/login');
        }
      }
      if (FORBIDDEN === message || status === 403) {
        console.warn(`You've attempted a ${FORBIDDEN} action`);
        Router.push(`/error-page/403`);
      }
      return null;
    });
  if (networkError && networkError.statusCode === 401) {
    // eslint-disable-next-line
    Router.push('/login');
    console.warn(UNAUTHORIZED);
  }
  if (networkError && networkError.statusCode === 403) {
    // Do something
    console.warn(FORBIDDEN);
  }
  if (networkError && networkError.statusCode >= 500) {
    // eslint-disable-next-line
    console.warn('SERVER ERROR');
    Router.push(`/error-page/${networkError.statusCode}`);
  }
});

let links = [errorLink, stateLink, afterwareLink, httpLink];

if (useLocalStorage) {
  links = [
    errorLink,
    stateLink,
    afterwareLink,
    authMiddlewareLink,
    httpLink,
  ];
}

const link = ApolloLink.from(links);
function create (initialState) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link,
    cache: apolloCache.restore(initialState || {})
  })
}

export default function initApollo (initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
