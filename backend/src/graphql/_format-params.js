import { OperationStore } from 'apollo-server-module-operation-store/dist/index';
import { AUTH } from '~/config';
import { schema } from '~/schema';
import { whitelistedOperations } from './_operations';
import { RESPONSE } from '~/environment';

let store;
if (AUTH.WHITELISTED_QUERIES) {
  store = new OperationStore(schema);
  whitelistedOperations.forEach(op => store.put(op));
}

export const formatParams = (params) => {
  if (AUTH.WHITELISTED_QUERIES) {
    params.query = store.get(params.operationName);
    if (!params.query) {
      throw new Error(`${RESPONSE.MESSAGES.NOT_WHITELISTED_QUERY} ${params.operationName}`);
    }
  }
  return params;
};
