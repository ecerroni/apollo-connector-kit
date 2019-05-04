import { default as SCOPES } from './_scopes';

const rolesAndPermissions = {
  ADMIN: {
    SPEC: SCOPES.ROLES.ADMIN,
    PERMISSIONS: {
      [SCOPES.OPERATION.READ]: [
        SCOPES.TYPE.PROFILE,
        // add more
      ],
      [SCOPES.OPERATION.CREATE]: [
        SCOPES.TYPE.PROFILE,
        // add more
      ],
    },
  },
  USER: {
    SPEC: SCOPES.ROLES.USER,
    PERMISSIONS: {
      [SCOPES.OPERATION.READ]: [
        // add more
      ],
      [SCOPES.OPERATION.CREATE]: [
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
