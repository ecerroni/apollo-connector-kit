import { userInputValidation } from '~/utils';
import inputSchema from './_yup';

export const mutationTypes = `
  type Mutation {
    testInputValidationOnMutation(yup: Int, text: String): JSON
  }
`;

export const mutationResolvers = {
  Mutation: {
    testInputValidationOnMutation: userInputValidation(
      inputSchema.inputTest,
      // eslint-disable-next-line
      (_, args, context) => {
        return args;
      }
    )
  }
};
