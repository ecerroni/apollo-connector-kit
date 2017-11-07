// Configuration file. One rules them all
export const server = {
  host: 'localhost',
  port: 3000,
  graphql: '/graphql',
  graphiql: '/graphiql',
};

export const whitelistedQueries = false;

export const database = {
  type: 'mySQL',
  host: 'localhost',
  port: 27017,
  name: 'askerik',
};

export const auth = {
  endpoint: process.env.AUTH_ENDPOINT,
  secret: process.env.AUTH_SECRET,
  cookie: {
    name: 'graphql_access_token', // be original
    expiration: '',
  },
  strategies: {
    // These shouldn't be mutually exclusive.
    // i.e. desktop client may send requests with httpOnly cookies while react native with token in localstorage
    // If it is that  way code in _auth.js needs refactoring
    // Not sure yet though about keeping them mutually exclusive or not.
    // Needs more thoughts
    httpOnly: false,
    localStorage: true, // when working with graphiQL localStorage must be true. Otherwise it doesn't work atm
  },
  usersDB: {
    isApi: false,
    isLocal: true,
  },
};
