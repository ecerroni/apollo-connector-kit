export default {
  OPERATION: {
    READ: 'read',
    EDIT: 'edit',
    CREATE: 'create',
    DELETE: 'delete'
    // add more
  },
  TYPE: {
    PROFILE: 'profile',
    BILLING: 'profile'
    // add more
  },
  ROLES: {
    OWNER: {
      RANK: 0,
      VALUE: 'OWNER'
    },
    ADMIN: {
      RANK: 1,
      VALUE: 'ADMIN'
    },
    USER: {
      RANK: 2,
      VALUE: 'USER'
    }
    // add more
  }
};
