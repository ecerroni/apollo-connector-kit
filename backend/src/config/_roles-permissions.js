import logTree from 'console-log-tree';
import SCOPES from './_scopes';
import ROLES_PERMISSIONS from '../../../settings/roles-permissions.json';
import {
  assignCascadeRoles,
  getAllFromSpec,
  getAllCombinedPermissions,
  sortItems,
  deepFlatten
} from '../utils';

const { OPERATION, USERS: RAWUSERS, GROUPS } = ROLES_PERMISSIONS;

const retrieveNestedKeys = (object, arr = []) => {
  if (!Array.isArray(object)) return [...arr, ...Object.keys(object)];
  return [
    ...arr,
    ...object.reduce((a, i) => [...a, ...retrieveNestedKeys(i, arr)], [])
  ];
};

const OWNER = {
  OWNER: {
    PERMISSIONS: {
      //
    }
  }
};

const buildRoles = roles =>
  roles.reduce((object, user) => {
    // do not want duplicates
    // user can appeary only once in the json hirearchy
    const keys = retrieveNestedKeys(user);

    if (keys.findIndex(key => object[key]) > -1)
      throw new Error('Duplicate user type');
    return {
      ...object,
      ...keys.reduce((o, key) => {
        // value can be either an object or an array
        const value = deepFlatten(roles).find(item => {
          if (Array.isArray(item)) {
            return item.findIndex(i => Object.keys(i)[0] === key) > -1;
          }
          return Object.keys(item)[0] === key;
        });
        const v = value[key];
        if (Array.isArray(value)) {
          // is this value a regular object or a nested array
          return {
            ...o,
            ...value.reduce((obj, arrayItem) => {
              const regular = !Array.isArray(arrayItem);
              if (!regular) {
                return {
                  ...obj,
                  ...buildRoles(arrayItem)
                };
              }
              return {
                ...obj,
                [key]: value.find(val => Object.keys(val)[0] === key)[key]
              };
            }, {})
          };
        }
        return {
          ...o,
          [key]: v
        };
      }, OWNER)
    };
  }, {});

const validateScopesAndPermissions = (permissions = []) => {
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

const buildPermissions = (permissions = []) => {
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

const USERS = buildRoles(RAWUSERS);

let ownerPermissions = {};

const rolesAndPermissions = Object.entries(SCOPES.ROLES).reduce(
  (obj, [key]) => {
    validateScopesAndPermissions(USERS[key]?.PERMISSIONS);
    const hasGroup =
      USERS[key].GROUPS &&
      Array.isArray(USERS[key].GROUPS) &&
      USERS[key].GROUPS.length;
    let permissions = buildPermissions(USERS[key]?.PERMISSIONS);

    if (hasGroup) {
      // ADD GROUP PERMISSIONS TO THIS USER
      const userGroups = USERS[key]?.GROUPS;
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

rolesAndPermissions.OWNER.PERMISSIONS = {
  ...ownerPermissions,
  // NOTE: add owner only specific permissions here
  // format OPERATION KEY: array of SCOPES
  // these are permissions will have in addition to what admin will have
  [OPERATION.DELETE]: [
    ROLES_PERMISSIONS.SCOPES.TEST,
    ROLES_PERMISSIONS.SCOPES.PROFILE
  ]
};
// console.log('####################################################');
// console.log('ROLES AND PERMISSIONS BINDING');
// console.log('####################################################');
// console.log(
//   Object.entries(rolesAndPermissions).reduce(
//     (obj, entry) => ({
//       ...obj,
//       [entry[0]]: {
//         permissions: {
//           ...Object.entries(entry[1].PERMISSIONS).reduce(
//             (o, e) => ({
//               ...o,
//               [e[0]]: e[1].join(', ')
//             }),
//             {}
//           )
//         }
//       }
//     }),
//     {}
//   )
// );
// console.log('####################################################');
// console.log('####################################################');
export default rolesAndPermissions;

const sortedRolesAndPermissions = sortItems({
  items: getAllFromSpec(rolesAndPermissions),
  field: 'rank'
});
const fullTreePermissions = Object.entries(rolesAndPermissions).reduce(
  (str, [key, value]) => {
    if (value.SPEC.VALUE === 'OWNER') return '';
    return `${str}
  ROLE: ${key}
  INHERITED_ROLES: [${assignCascadeRoles(value.SPEC, sortedRolesAndPermissions)
    .filter(role => role !== key)
    .join(', ')}]
  GROUPS: [${USERS[key]?.GROUPS ? USERS[key].GROUPS.join(', ') : ''}]
  ALL PERMISSIONS: [\n    ${getAllCombinedPermissions(
    getAllFromSpec(rolesAndPermissions),
    assignCascadeRoles(value.SPEC, sortedRolesAndPermissions)
  ).join('\n    ')}\n  ]

-----------------------------------------------------------------
  `;
  },
  ''
);
const rolesAndFullPermissions = Object.entries(rolesAndPermissions).reduce(
  (obj, [key, value]) => ({
    ...obj,
    [key]: {
      PERMISSIONS: getAllCombinedPermissions(
        getAllFromSpec(rolesAndPermissions),
        assignCascadeRoles(value.SPEC, sortedRolesAndPermissions)
      )
    }
  }),
  {}
);
const permissionsInRoles = Object.entries(rolesAndFullPermissions).reduce(
  (object, [key, { PERMISSIONS: permissions = [] }]) => ({
    ...object,
    ...permissions.reduce((obj, value) => {
      if (!value || value.includes('_undefined')) return obj;
      let item = { [value]: [key] };
      if (object[value]) item = { [value]: [...object[value], key] };
      if (obj[value]) item = { [value]: [...obj[value], key] };
      return {
        ...obj,
        ...item
      };
    }, {})
  }),
  {}
);

const sameRankKey = (arr, obj) =>
  arr.reduce((key, item) => {
    if (
      obj.container === item.container &&
      obj.name !== item.name &&
      obj.rank === item.rank
    )
      return item.name;
    if (item.children?.length) return sameRankKey(item.children, obj);
    return key;
  }, '');

const appendToEqualRankKey = (targetKey, key, a = []) =>
  a.reduce((arr, item) => {
    // if (item.children?.length)
    //   return [
    //     ...arr,
    //     {
    //       ...item,
    //       children: appendToEqualRankKey(targetKey, key, item.children)
    //     }
    //   ];
    return [
      ...arr,
      {
        ...item,
        name:
          item.name.includes(targetKey) && !item.name.includes(key)
            ? `${item.name}|${key}`
            : item.name,
        children: appendToEqualRankKey(targetKey, key, item.children)
      }
    ];
  }, []);

const utilizedRoles = [];
const rPyramid = roles =>
  Object.entries(roles).reduce((arr, [key, value]) => {
    if (typeof value?.LEVEL === 'undefined') return arr; // it's OWNER
    if (utilizedRoles.includes(key)) return arr; // it's already in the tree
    utilizedRoles.push(key);
    const euqalRankKey = sameRankKey(arr, {
      name: key,
      rank: value.RANK,
      level: value.LEVEL,
      container: value.CONTAINER
    });
    if (euqalRankKey) {
      return [...appendToEqualRankKey(euqalRankKey, key, arr)];
    }
    const cascadeRoles = assignCascadeRoles(value, sortedRolesAndPermissions);

    if (Array.isArray(cascadeRoles) && !cascadeRoles.length)
      return [
        ...arr,
        {
          name: key,
          rank: value.RANK,
          level: value.LEVEL,
          container: value.CONTAINER,
          children: []
        }
      ];
    const childrenKeys = cascadeRoles.filter(role => role !== key);

    return [
      ...arr,
      {
        name: key,
        rank: value.RANK,
        level: value.LEVEL,
        container: value.CONTAINER,
        children: rPyramid(
          Object.entries(SCOPES.ROLES)
            .filter(([k]) => childrenKeys.includes(k))
            .reduce((o, entry) => ({ ...o, [entry[0]]: entry[1] }), {})
        )
      }
    ];
  }, []);

// eslint-disable-next-line no-unused-vars
const containers = Object.values(rolesAndPermissions).reduce(
  (obj, { SPEC: role }) => {
    const id = `container_${
      typeof role.CONTAINER === 'undefined' ? 'owner' : role.CONTAINER
    }`;
    return {
      ...obj,
      ...(obj[id] && {
        [id]: [...obj[id], role.VALUE]
      }),
      ...(!obj[id] && {
        [id]: [role.VALUE]
      })
    };
  },
  {}
);

const pyramid = rPyramid(SCOPES.ROLES);
const tree = logTree.parse(pyramid);

console.log('####################################################');
console.log('ROLES TREE');
console.log('####################################################');
console.log('OWNER');
console.log(tree);
console.log('####################################################');
console.log("ROLES' GROUPS AND COMPUTED PERMISSIONS");
console.log('####################################################');
console.log(fullTreePermissions);
console.log('####################################################');
console.log('PERMISSIONS IN ROLES');
console.log('####################################################');
console.log(permissionsInRoles);

// uncomment if you need a more detailed view of the roles' containarization
// console.log('ROLES CONTAINERS ISOLATION');
// console.log('####################################################');
// console.log(Object.values(containers));

console.log('####################################################');
console.log('####################################################');

/* HIERARCHY BUILDING BLOCKS
{}, // parent (root)
{}, // child (a) of [root]
[   // children of [a] with same rank
  {}, // child (a1) of [a]
  {}  // child (a2) of [a]
],
[  // children of [a] in nested (isolated) level
  [
    {}, // child (a3) of [a]
    {}  // child (a4) of [a]
  ]
],
{} // child (b) of [root]
*/
