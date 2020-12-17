# APOLLO CONNECTOR KIT

[![Build Status](https://img.shields.io/travis/ecerroni/apollo-connector-kit/master.svg?style=flat-square)](https://travis-ci.org/ecerroni/apollo-connector-kit) [![Coverage Status](https://img.shields.io/codecov/c/github/ecerroni/apollo-connector-kit/master.svg?style=flat-square)](https://codecov.io/gh/ecerroni/apollo-connector-kit/branch/master)

Boilerplate for Apollo authentication/authorization

![demo](./apollo-connector-kit.gif "Apollo Connector Kit")

Ecosystem:
- Apollo 2 Server (with Express)
- Apollo Client 2.0
- Vue.js (frontend web client)
- React (frontend web client)


## Installation
Clone this repo using

`git clone https://github.com/ecerroni/apollo-connector-kit.git`

Move to the appropriate directory:

`cd apollo-connector-kit`

From the project's root folder

`yarn install-all`

## Run whole development
from the project's root folder

`yarn start`

## Run a single server
You may also run servers separately

### VUE
from the project's root folder

`cd frontend-vue && yarn dev`

### REACT
from the project's root folder

`cd frontend-react && yarn dev`

### APOLLO
from the project's root folder

`cd backend && yarn start`

## Version compatibility
### Bcrypt
Depending on bcrypt's version you need to use a specific node LTS version to make it work properly. This is even more importan in production environemnts to avoid build errors like `gyp ERR!....`

Here there is a table compatibility you should follow:
https://www.npmjs.com/package/bcrypt#version-compatibility

The current bcrypt version used in this boilerplate requires Node.js LTS >= 12
## Usage

### USERS
There are 2 mock users:

[Admin role]

username: rico

password: 123456

--------------

[Limited permissions role]

username: george

password: 123456

### SETTINGS
All essentials settings are under the `settings` folder.

You may change them as you see fit and they will propagate to the backend as well as across
all client folders.

N.B. Because of how CRA works the frontend react will not pickup changes even after restarting the
server (like Vue does, but for few changes related to the endpoint);

As a workaround you should always stop the server and run from the root project:

`cd frontend-react && yarn install`

Then restart the server

#### app.json
```
{
  "NAMESPACE": "connector", // Change the namespace to match your app name or anything else you like. This value will be used to build the tokens name like `connectorToken` and `connectorRefreshToken` as well as the headers' names
  "ENDPOINT": { // this is mainly for local development
    "PROTOCOL": "http",
    "HOST": "localhost",
    "PORT": 3000,
    "GRAPHQL": "/graphql",
    "GRAPHIQL": "/graphiql",
    "PAYLOAD": { // this however will affect also production environment
      "JSON": {
        "LIMIT": "50mb"
      },
      "URL_ENCODED": {
        "LIMIT": "50mb",
        "PARAMETER_LIMIT": 100000
      }
    }
  },
  "CONSTANTS": { // change them as you need
    "HTTP_ONLY": "HTTP_ONLY",
    "LOCAL_STORAGE": "LOCAL_STORAGE",
    "FORBIDDEN": "Forbidden",
    "UNAUTHORIZED": "Unauthorized!",
    "NOT_ALLOWED": "Not allowed"
  },
  "STRATEGIES": { // this affects the backend server only. Use of both strategies at the same time will work
    "HTTP_ONLY": true, // tokens are stored in cookies
    "LOCAL_STORAGE": true // tokens are stored in localStorage (on the client)
  },
  // the following builds up the headers name together with the namespace
  "PREFIX": "x-", 
  "TOKEN_SUFFIX": "-token",
  "REFRESH_TOKEN_SUFFIX": "-refresh-token",
  "AUTH_HEADER_SUFFIX": "-auth-request-type"
}
```

#### cookie.json
If `HTTP_ONLY` is set to `true` in `app.json` you can change the cookie's expiration time as you need
```
{
  "COOKIE_EXP": 31536000000
}

```

#### jwt.json
This is the expiratin time of the tokens in seconds
```
{
  "TOKEN_EXP": 360,
  "REFRESH_TOKEN_EXP": 604800
}
```

#### queries.json
These are exclusively for apollo backend
```
{
  "PRIVATE_PREFIX": "_", // queries and mutations that have this prefix will always throw an 401 error if they are invoke by a non-valid user
  "DEPTH_LIMIT": 5, // max depth limit allowed in queries
  "MAX_COST": 1000 // max cost allowed for a query
}
```
#### roles-permissions.json
All application roles and permissions are set here

**HIERARCHY BUILDING BLOCKS**
- Top-down: higher users in the tree inherit roles from lower levels as long as they are in the same sub-tree
- Sibilings: sibilings do not inherit permissions from each other despite their order

`{}` creates a tree leaf
`[]` creates a tree leaf of sibilings
`[[]]` creates a sub-tree

Example:

  - `{}` parent (root)
  - `{}` child (a) of [root]
  - `[` grand-children of [root] and children of [a] with same rank, i.e sibilings
        `{}`, child (a1) of [a]
        `{}` child (a2) of [a]
      `]`,
  - `[[`   grand-children of [root] children of [a] in nested (isolated) level, i.e. sub-tree
      `{}` child (a3) of [a]
      `{}` child (a4) of [a]
    `]]`
  - `{}` child (b) of [root]

Real-world example:
```
{
  "OPERATION": {
    "READ": "read",
    "UPDATE": "update",
    "CREATE": "create",
    "DELETE": "delete"
  },
  "SCOPES": {
    "USER_PROFILE": "userProfile",
    "EMPLOYEE_PROFILE": "employeeProfile",
    "BADGE": "badge"
  },
  "GROUPS": {
    "VOLUNTEERS": {
      "PERMISSIONS": {
        "BADGE": [
          "READ"
        ]
      }
    }
  },
  "USERS": [
    {
      "ADMIN": {
        "PERMISSIONS": {
          "USER_PROFILE": [
            "UPDATE",
            "DELETE"
          ],
          "BADGE": [
            "CREATE",
            "UPDATE",
            "DELETE"
          ]
        }
      }
    },
    [[
        [
          {
            "HR": {              
              "PERMISSIONS": {
                "USER_PROFILE": [
                  "CREATE",
                  "READ",
                  "UPDATE"
                ],
                "EMPLOYEE_PROFILE": [
                  "CREATE",
                  "READ",
                  "UPDATE"
                ]
              }
            }
          },
          {
            "STAFF": {
              "GROUPS": ["VOLUNTEERS"],
              "PERMISSIONS": {                
                "EMPLOYEE_PROFILE": [
                  "READ"
                ]
              }
            }
          }
        ]
    ]],
    {
      "USER": {
        "GROUPS": ["VOLUNTEERS"],
        "PERMISSIONS": {
          "USER_PROFILE": [
            "READ",
            "UPDATE"
          ]
        }
      }
    }
  ]
}
```

###### Ouput of the above roles/permissions
```
####################################################
ROLES TREE
####################################################
OWNER
└── ADMIN
    ├── HR|STAFF
    └── USER

####################################################
ROLES' GROUPS AND COMPUTED PERMISSIONS
####################################################

  ROLE: ADMIN
  INHERITED_ROLES: [HR, STAFF, USER]
  GROUPS: []
  ALL PERMISSIONS: [
    update_userProfile
    update_badge
    delete_userProfile
    delete_badge
    create_badge
    create_userProfile
    create_employeeProfile
    read_userProfile
    read_employeeProfile
    update_employeeProfile
    read_badge
  ]

-----------------------------------------------------------------
  
  ROLE: HR
  INHERITED_ROLES: []
  GROUPS: []
  ALL PERMISSIONS: [
    create_userProfile
    create_employeeProfile
    read_userProfile
    read_employeeProfile
    update_userProfile
    update_employeeProfile
  ]

-----------------------------------------------------------------
  
  ROLE: STAFF
  INHERITED_ROLES: []
  GROUPS: [VOLUNTEERS]
  ALL PERMISSIONS: [
    read_employeeProfile
    read_badge
  ]

-----------------------------------------------------------------
  
  ROLE: USER
  INHERITED_ROLES: []
  GROUPS: [VOLUNTEERS]
  ALL PERMISSIONS: [
    read_userProfile
    read_badge
    update_userProfile
  ]

-----------------------------------------------------------------
  
####################################################
PERMISSIONS IN ROLES
####################################################
{
  update_userProfile: [ 'OWNER', 'ADMIN', 'HR', 'USER' ],
  update_badge: [ 'OWNER', 'ADMIN' ],
  update_employeeProfile: [ 'OWNER', 'ADMIN', 'HR' ],
  create_badge: [ 'OWNER', 'ADMIN' ],
  create_userProfile: [ 'OWNER', 'ADMIN', 'HR' ],
  create_employeeProfile: [ 'OWNER', 'ADMIN', 'HR' ],
  read_userProfile: [ 'OWNER', 'ADMIN', 'HR', 'USER' ],
  read_employeeProfile: [ 'OWNER', 'ADMIN', 'HR', 'STAFF' ],
  read_badge: [ 'OWNER', 'ADMIN', 'STAFF', 'USER' ],
  delete_userProfile: [ 'ADMIN' ],
  delete_badge: [ 'ADMIN' ]
}
####################################################
####################################################


```

###### How to enforce roles and permissions in queries and mutations using custom directives

Once the `roles-permissions.json` is saved and the backend server started all roles and permissions custom directive get build programmatically.

You will able to enforce them following this pattern:
Roles: roles.is.{role}
Permissions: permissions.can.{operation}.{scope}

> ###### At field level
```
import { permissions } from '../../../directives';

export const types = `
  type User {
    id: String!
    name: String
    username: String
    email: String @${permissions.can.read.user_profile}
  }`;
```

> ##### at query/mutation level
```
    testPermissionsHasRole: String @${roles.is.admin}
    testPermissionsIsAllowed: String @${permissions.can.read.badge}
```

### AUHENTICATION STRATEGIES

#### Server
By default it accepts both LOCAL_STORAGE and HTTP_ONLY requests from clients.

If you want to narrow it down to just on type of authentication request being accepted you will need to set either one of the following to `false` in `./settings/app.json`:

```
  "STRATEGIES": {
    "HTTP_ONLY": true,
    "LOCAL_STORAGE": true
  },
```

If you set them both to `false` the server will stop accepting requests altogether.

#### Client
The client to have its requests accepted by the server it needs to declare what authentication strategy it is willing to use. The choosen strategy should match one of those allowed by the server, otherwise client's requests will be always rejected.

To set which type of authentication requests the client is willing to use set it here:
- For React: `./frontend-react/src/environment/_auth.js`
- For Vue: `./frontend-vue/src/environment/_auth.js`

Choose local storage

`export const CLIENT_AUTH_REQUEST_TYPE = AUTH.STRATEGIES.CLIENT.LOCAL_STORAGE;`

OR 

Choose cookies

`export const CLIENT_AUTH_REQUEST_TYPE = AUTH.STRATEGIES.CLIENT.HTTP_ONLY`

### APOLLO GRAPHQL COMPONENTS
You may create new graphql components just by typing from project's root folder:

`cd backend`

`yarn add-component-part <component_name> <component_part>`

Ex. `yarn add-component-part User user-authentication`

The above will create under `components` a new folder named `User` with a subfolder named
`user-authentication`

`user-authentication` has all files needed to implement your component. You just need to fill them;

- `_input.js`: input types you need for your component part's mutations
- `_mutation.js`: all mutations for this component part go here
- `_query.js`: all queries for this component part go here
- `_type.js`: all types and type resolvers for this component part go here

You may implement only what you need, though you should never delete any of these files. For example
if you have no mutations and no inputs for a component part you should not delete _input.js and
mutations.js. Just leave them there as they were created by the script.

Each component has at least one part, though it can have many.

Ex.
components
```
- components
-- User
--- user-authentication
--- user-data
```

You may want to delete an existing graphql components just by typing from project's root folder:

`cd backend`

`yarn remove-component-part <component_name> <component_part>`

Ex. `yarn remove-component-part User user-authentication`

The above will delete under `components` in the folder named `User` the subfolder named
`user-authentication`

Moreover if the folder named `User` has no more sub-part it will be deleted by the script as well

Otherwise the server/nodemon may not immediately pick up changes in components' structure and even
throw errors (for example adding/deleting components manually),

## Related projects:
[Apollo Cache Updater](https://github.com/ecerroni/apollo-cache-updater)

## Additional:
[Medium post](https://blog.mvp-space.com/authentication-and-authorization-boilerplate-with-apollo-2-0-b77042aba3f6)

## TODO:


## Thanks To
- [Ryan Chenkie's GraphQL Summit 2017 talk](https://www.youtube.com/watch?v=4_Bcw7BULC8)
- [Zach Silveira's blog](https://zach.codes/tag/graphql)
- [Ben Awad' Video tutorial](https://www.youtube.com/watch?v=0MKJ7JbVnFc)