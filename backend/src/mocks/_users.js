import { ROLES_PERMISSIONS, SCOPES } from '~/config';

// online hash.js emulator
// http://www.xorbin.com/tools/sha256-hash-calculator

// online bcrypt emulator (use 12 rounds)
// https://www.dailycred.com/article/bcrypt-calculator
export const mockUsers = [
  {
    id: 1,
    name: 'Enrico',
    username: 'rico',
    email: 'admin@test.it',
    password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna', // this is === 123456
    roles: [
      ROLES_PERMISSIONS.ADMIN.NAME,
      ROLES_PERMISSIONS.USER.NAME,
    ],
    permissions: [
      ...ROLES_PERMISSIONS.ADMIN.PERMISSIONS[SCOPES.OPERATION.READ].map(permission =>
        `${SCOPES.OPERATION.READ}_${permission}`),
      ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(permission => `${SCOPES.OPERATION.READ}:${permission}`),
    ],
  },
  {
    id: 2,
    name: 'George',
    username: 'george',
    email: 'test@test.it',
    password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
    roles: [
      ROLES_PERMISSIONS.USER.NAME,
    ],
    permissions: [
      ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(permission =>
        `${SCOPES.OPERATION.READ}_${permission}`),
    ],
  },
];

