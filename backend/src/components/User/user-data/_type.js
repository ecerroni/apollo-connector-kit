import { permissions } from '../../../directives';

export const types = `
  type User {
    id: String!
    name: String
    username: String
    email: String @${permissions.can.read.profile}
  }`;

export const typeResolvers = {
  //
};
