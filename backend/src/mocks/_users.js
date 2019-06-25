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
    delta: 0,
    role: {
      value: SCOPES.ROLES.ADMIN.VALUE,
      rank: SCOPES.ROLES.ADMIN.RANK,
      permissions: Object.entries(ROLES_PERMISSIONS.ADMIN.PERMISSIONS).map(
        entry => `${entry[0]}_${entry[1]}`
      )
    }
  },
  {
    id: 2,
    name: 'George',
    username: 'george',
    email: 'test@test.it',
    password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
    delta: 0,
    role: {
      value: SCOPES.ROLES.USER.VALUE,
      rank: SCOPES.ROLES.USER.RANK,
      permissions: Object.entries(ROLES_PERMISSIONS.USER.PERMISSIONS).map(
        entry => `${entry[0]}_${entry[1]}`
      )
    }
  }
];
