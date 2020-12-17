import { permissions } from '../../../directives';

export const types = `
  type User {
    id: ID!
    name: String
    username: String
    email: String @${permissions.can.read.user_profile}
  }`;

export const typeResolvers = {
  //
};
