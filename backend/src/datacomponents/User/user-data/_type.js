import { permissions } from '../../../directives';

export const types = `
  type User {
    id: String!
    name: String
    username: String
    email: String @${permissions.can.read.billing}
  }`;

export const typeResolvers = {
  //
};
