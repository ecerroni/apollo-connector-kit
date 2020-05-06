import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import decode from 'jwt-decode'
import { APP, SERVER_MESSAGES, AUTH, CLIENT_AUTH_REQUEST_TYPE, CLIENT_AUTHENTICATION_METHOD, JWT } from './_config'
import history from '../history'
import { defaults as initLocalState, resolvers } from '../api'

const {
  UNAUTHORIZED,
  FORBIDDEN,
} = SERVER_MESSAGES

const { ROUTES: { LOGIN, LOGOUT } = {} } = APP

const opts = {
  credentials: 'same-origin',
  headers: {
    [AUTH.STRATEGIES.CLIENT.AUTH_HEADER]: CLIENT_AUTH_REQUEST_TYPE,
  },
}

const useLocalStorage = CLIENT_AUTHENTICATION_METHOD.LOCAL_STORAGE

// const apolloCache = new InMemoryCache();

const apolloCache = new InMemoryCache({
  dataIdFromObject: e => `${e.__typename}_${e.id}` || null, // eslint-disable-line no-underscore-dangle
})

const httpLink = new HttpLink({
  uri: APP.ENDPOINT.GRAPHQL,
  ...opts,
})

const authMiddlewareLink = setContext(() => {
  const headers = {
    headers: {
      [JWT.HEADER.TOKEN.NAME]:
        localStorage.getItem(JWT.LOCAL_STORAGE.TOKEN.NAME) || null,
      [JWT.HEADER.REFRESH_TOKEN.NAME]: localStorage.getItem(JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME) || null, // eslint-disable-line
    },
  }

  if (headers.headers[JWT.HEADER.REFRESH_TOKEN.NAME]) {
    const currentTime = Date.now().valueOf() / 1000
    const tokenExpiration = decode(
      headers.headers[JWT.HEADER.REFRESH_TOKEN.NAME],
    ).exp
    if (currentTime > tokenExpiration) {
      history.push(LOGIN)
    }
  }
  return headers
})

const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map(response => {
    const context = operation.getContext()
    const { response: { headers } } = context

    if (headers) {
      const token = headers.get(JWT.HEADER.TOKEN.NAME)
      const refreshToken = headers.get(JWT.HEADER.REFRESH_TOKEN.NAME)

      if (token) {
        localStorage.setItem(JWT.LOCAL_STORAGE.TOKEN.NAME, token)
      }

      if (refreshToken) {
        localStorage.setItem(
          JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME,
          refreshToken,
        )
      }
    }

    return response
  }),
)

const errorLink = onError(({ graphQLErrors = [], networkError = {} }) => {
  const redirect = (networkError && networkError.statusCode) ||
  (graphQLErrors && graphQLErrors.length > 0);
    if (redirect) {
      let { statusCode } = networkError;
      if (!statusCode) {
        const errors = graphQLErrors
          .filter(e => e.status === 403 || e.status === 401);
        const { status = 200 } = errors[0] || {};
        statusCode = status;
      }
      if (statusCode === 401) {
        console.warn(`You've attempted to access ${UNAUTHORIZED} section`)
            if (
              history &&
              history.location &&
              history.location.pathname !== LOGIN
            ) {
              history.push(LOGIN)
            }
      }
      if (statusCode === 403) {
        console.warn(`You've attempted a ${FORBIDDEN} action`)
        history.push(`/error-page/403`)
      }
      if ((statusCode >= 500)) {
        console.warn('SERVER ERROR');
        history.push(`/error-page/${networkError.statusCode}`)
    }
  }
})

let links = [errorLink, httpLink]

if (useLocalStorage) {
  links = [
    errorLink,
    afterwareLink,
    authMiddlewareLink,
    httpLink,
  ]
}

const link = ApolloLink.from(links)

const client = new ApolloClient({
  link,
  cache: apolloCache,
  resolvers,
  connectToDevTools: true,
})

const resetLocalStorageTokens = () => {
  localStorage.removeItem(JWT.LOCAL_STORAGE.TOKEN.NAME)
  localStorage.removeItem(JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME)
}

if (useLocalStorage) {
  client.onClearStore(() => resetLocalStorageTokens())
  client.onResetStore(() => resetLocalStorageTokens())
}

initLocalState(apolloCache)

export default client
