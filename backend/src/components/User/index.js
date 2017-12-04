import userAuthentication from './user-authentication';
import userData from './user-data';


const userTypes = [
  userAuthentication.types,
  userData.types,
];

const userResolvers = [
  userAuthentication.resolvers,
  userData.resolvers,
];

export { userTypes, userResolvers };
