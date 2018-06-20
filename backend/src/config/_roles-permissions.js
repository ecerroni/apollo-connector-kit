import { default as SCOPES } from './_scopes';

export default {
  ADMIN: {
    NAME: SCOPES.ROLES.ADMIN,
    PERMISSIONS: {
      [SCOPES.OPERATION.READ]: [
        SCOPES.TYPE.COMMENTS,
        SCOPES.TYPE.PROFILE,
        // add more
      ],
      [SCOPES.OPERATION.WRITE]: [
        SCOPES.TYPE.COMMENTS,
        SCOPES.TYPE.PROFILE,
        // add more
      ],
    },
  },
  USER: {
    NAME: SCOPES.ROLES.USER,
    PERMISSIONS: {
      [SCOPES.OPERATION.READ]: [
        SCOPES.TYPE.COMMENTS,
        // add more
      ],
      [SCOPES.OPERATION.WRITE]: [
        SCOPES.TYPE.COMMENTS,
        // add more
      ],
    },
  },
  // add more
};
