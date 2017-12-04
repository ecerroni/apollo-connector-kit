export { directives, DIRECTIVES } from './_directives';
export { attachDirectives } from './_attach-schema';
export {
  canReadProfile,
  canReadComments,
  isAdmin,
} from './_constraints';

// TODO: Switch to attachDirectiveResolvers when it becomes a thing
// https://github.com/apollographql/graphql-tools/pull/518
