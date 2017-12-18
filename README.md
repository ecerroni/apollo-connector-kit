# APOLLO CONNECTOR KIT
Boilerplate for Apollo authentication/authorization

![demo](./apollo-connector-kit.gif "Apollo Connector Kit")

Ecosystem:
- Apollo Server (with Express)
- Apollo Client 2.0
- Vue.js (frontend web client)


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

`cd frontend && yarn dev`

### APOLLO
from the project's root folder

`cd backend && yarn launch`

## Additional:
[Medium post](https://blog.mvp-space.com/authentication-and-authorization-boilerplate-with-apollo-2-0-b77042aba3f6)

## TODO:
- add graphql-tester package and initial tests
- Swap ElementUI with KeenUI (if is it worth)



## Thanks To
- [Ryan Chenkie's GraphQL Summit 2017 talk](https://www.youtube.com/watch?v=4_Bcw7BULC8)
- [Zach Silveira's blog](https://zach.codes/tag/graphql)
- [Ben Awad' Video tutorial](https://www.youtube.com/watch?v=0MKJ7JbVnFc)