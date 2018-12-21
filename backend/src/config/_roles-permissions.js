import { default as SCOPES } from './_scopes';

const rolesAndPermissions = {
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
console.log('####################################################');
console.log('ROLES AND PERMISSIONS BINDING');
console.log('####################################################');
console.log(Object.entries(rolesAndPermissions).reduce((obj, entry) => ({
  ...obj,
  [entry[0]]: {
    permissions: {
      ...Object.entries(entry[1].PERMISSIONS).reduce((o, e) => ({
        ...o,
        [e[0]]: e[1].join(', '),
      }), {}),
    },
  },
}), {}));
console.log('####################################################');
console.log('####################################################');
export default rolesAndPermissions;
