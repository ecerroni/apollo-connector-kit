import SCOPES from './_scopes';
import ROLES_PERMISSIONS from '../../../settings/roles-permissions.json';

const { OPERATION, USERS: RAWUSERS, GROUPS } = ROLES_PERMISSIONS;

const validateScopesAndPermissions = permissions => {
  // SCOPES AND OPERATIONS IN PERMISSIONS SHOULD ALWAYS BE VALID
  Object.entries(permissions).forEach(function([scope, operations]) {
    if (!SCOPES.TYPE[scope])
      throw new Error(
        `${scope} not included in [${Object.keys(SCOPES.TYPE).join(',')}]`
      );
    operations.forEach(function(operation) {
      if (!OPERATION[operation])
        throw new Error(
          `${operation} not included in [${Object.keys(SCOPES.OPERATION).join(
            ','
          )}]`
        );
    });
  });
};

const validateUserGroups = (groups, user) => {
  groups.forEach(function(group) {
    if (!Object.keys(GROUPS).includes(group))
      throw new Error(
        `${group} of ${user} must be one of [${Object.keys(GROUPS).join(',')}]`
      );
  });
};

const buildPermissions = permissions => {
  return Object.entries(permissions).reduce(
    (obj, [key, value]) => ({
      ...obj,
      ...value.reduce(
        (o, v) => ({
          ...o,
          [OPERATION[v]]: obj[OPERATION[v]]
            ? [...obj[OPERATION[v]], SCOPES.TYPE[key]]
            : [SCOPES.TYPE[key]]
        }),
        {}
      )
    }),
    {}
  );
};

const USERS = RAWUSERS.reduce((obj, user) => {
  // do not want duplicates
  // user can appeary only once in the json hirearchy
  const keys = Array.isArray(user)
    ? user.map(u => Object.keys(u)[0])
    : [Object.keys(user)[0]];

  if (keys.findIndex(key => obj[key]) > -1)
    throw new Error('Duplicate user type');
  return {
    ...obj,
    ...keys.reduce(
      (o, key) => {
        // value can be either an object or an array
        const value = RAWUSERS.find(item => {
          if (Array.isArray(item)) {
            return item.findIndex(i => Object.keys(i)[0] === key) > -1;
          }
          return Object.keys(item)[0] === key;
        });
        return {
          ...o,
          [key]: Array.isArray(value)
            ? value.find(v => Object.keys(v)[0] === key)[key]
            : value[key]
        };
      },
      {
        OWNER: { PERMISSIONS: {} }
      }
    )
  };
}, {});

let ownerPermissions = {};

const rolesAndPermissions = Object.entries(SCOPES.ROLES).reduce(
  (obj, [key]) => {
    validateScopesAndPermissions(USERS[key].PERMISSIONS);
    const hasGroup =
      USERS[key].GROUPS &&
      Array.isArray(USERS[key].GROUPS) &&
      USERS[key].GROUPS.length;
    let permissions = buildPermissions(USERS[key].PERMISSIONS);

    if (hasGroup) {
      // ADD GROUP PERMISSIONS TO THIS USER
      const userGroups = USERS[key].GROUPS;
      validateUserGroups(userGroups, key);
      const userPermissions = { ...permissions };
      const groupPermissions = {
        // eslint-disable-next-line no-shadow
        ...userGroups.reduce((obj, group) => {
          // eslint-disable-next-line no-shadow
          const groupPermissions = GROUPS[group].PERMISSIONS;
          validateScopesAndPermissions(groupPermissions);
          return {
            ...obj,
            ...buildPermissions(groupPermissions)
          };
        }, {})
      };
      permissions = {
        ...Object.entries(groupPermissions).reduce(
          // eslint-disable-next-line no-shadow
          (obj, [key, permissions]) => {
            if (userPermissions[key])
              return {
                ...obj,
                [key]: Array.from(
                  new Set([...userPermissions[key], ...permissions])
                )
              };
            return {
              ...obj,
              [key]: permissions
            };
          },
          {}
        )
      };
    }
    // FEED OWNER PERMISSIONS - IT SHOULD HAVE THEM ALL
    ownerPermissions = {
      // eslint-disable-next-line no-shadow
      ...Object.entries(permissions).reduce((obj, [key, value]) => {
        if (ownerPermissions[key])
          return {
            ...ownerPermissions,
            ...obj,
            [key]: Array.from(new Set([...ownerPermissions[key], ...value]))
          };
        return {
          ...ownerPermissions,
          ...obj,
          [key]: value
        };
      }, {})
    };
    return {
      ...obj,
      [key]: {
        SPEC: SCOPES.ROLES[key],
        PERMISSIONS: permissions
      }
    };
  },
  {}
);

rolesAndPermissions.OWNER.PERMISSIONS = ownerPermissions;
console.log('####################################################');
console.log('ROLES AND PERMISSIONS BINDING');
console.log('####################################################');
console.log(
  Object.entries(rolesAndPermissions).reduce(
    (obj, entry) => ({
      ...obj,
      [entry[0]]: {
        permissions: {
          ...Object.entries(entry[1].PERMISSIONS).reduce(
            (o, e) => ({
              ...o,
              [e[0]]: e[1].join(', ')
            }),
            {}
          )
        }
      }
    }),
    {}
  )
);
console.log('####################################################');
console.log('####################################################');
export default rolesAndPermissions;
