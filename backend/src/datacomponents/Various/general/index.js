import { types, typeResolvers } from './_type';
import { queryTypes, queryResolvers } from './_query';
import inputTypes from './_input';
import { mutationTypes, mutationResolvers } from './_mutation';

export default {
  types: `
    ${types}
    ${queryTypes}
    ${inputTypes}
    ${mutationTypes}
  `,
  resolvers: Object.assign(queryResolvers, mutationResolvers, typeResolvers)
};
