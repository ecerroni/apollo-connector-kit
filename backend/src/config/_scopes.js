import ROLES_PERMISSIONS from '../../../settings/roles-permissions.json';

const { OPERATION, USERS, SCOPES } = ROLES_PERMISSIONS;

const OWNER = {
  RANK: 0,
  VALUE: 'OWNER'
};

let offset = 0;
let isolation = 0;
const buildRoles = (roles, level = 0, container = 0, pIndexes = [0]) => {
  return roles.reduce(
    (obj, type, index) => {
      let values = {};
      offset = offset + level + 1;
      if (Array.isArray(type)) {
        values = type.reduce((o, item) => {
          if (Array.isArray(item)) {
            isolation += 1;
            return {
              ...obj,
              ...buildRoles(item, level + 1, isolation, [...pIndexes, index])
            };
          }
          return {
            ...o,
            [Object.keys(item)[0]]: {
              RANK: offset + index + 1,
              VALUE: Object.keys(item)[0],
              LEVEL: level,
              CONTAINER: container,
              IDS: pIndexes
            }
          };
        }, {});
      } else {
        values = {
          [Object.keys(type)[0]]: {
            RANK: offset + index + 1,
            VALUE: Object.keys(type)[0],
            LEVEL: level,
            CONTAINER: container,
            IDS: pIndexes
          }
        };
      }
      return {
        ...obj,
        ...values
      };
    },
    { OWNER }
  );
};

const ROLES = buildRoles(USERS);

// uncomment if you need a more detailed view of the roles' hierarchy
// console.log('####################################################');
// console.log('ROLES HIERARCHY WITH RANK, LEVEL AND CONTAINERS');
// console.log('####################################################');
// console.log(ROLES);

// eslint-disable-next-line no-unused-vars
const getRolePermissions = permissions =>
  Object.entries(permissions).reduce(
    (arr, entry) => [
      ...arr,
      ...entry[1].reduce((a, s) => [...a, `${entry[0]}_${s}`], [])
    ],
    []
  );

export default {
  OPERATION,
  TYPE: SCOPES,
  ROLES
};
