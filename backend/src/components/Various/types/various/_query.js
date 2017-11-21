import { PUBLIC_PREFIX } from '#/common/strategies';
import { SCOPES } from '@/config';
import { DIRECTIVES } from '@/directives';

const canReadComments = `${DIRECTIVES.IS_ALLOWED.NAME}(${DIRECTIVES.IS_ALLOWED.SCOPE}: ["${SCOPES.OPERATION.READ}:${SCOPES.TYPE.COMMENTS}"])`;
const canReadProfile = `${DIRECTIVES.IS_ALLOWED.NAME}(${DIRECTIVES.IS_ALLOWED.SCOPE}: ["${SCOPES.OPERATION.READ}:${SCOPES.TYPE.PROFILE}"])`;
const isAdmin = `${DIRECTIVES.HAS_ROLE.NAME}(${DIRECTIVES.HAS_ROLE.SCOPE}: ["${SCOPES.ROLES.ADMIN}"])`;


export default `
  type Query {
    ${PUBLIC_PREFIX}Test: String @${canReadProfile}
    ${PUBLIC_PREFIX}AAA: AAA @${isAdmin}
    connection: String!
    checkAuth: String
  }
`;
