import { SCOPES } from '~/config';

// online hash.js emulator
// http://www.xorbin.com/tools/sha256-hash-calculator

// online bcrypt emulator (use 12 rounds)
// https://www.dailycred.com/article/bcrypt-calculator
export const mockUsers = [
  {
    id: Buffer.from('Mock:Enrico').toString('base64'),
    name: 'Enrico',
    username: 'rico',
    email: 'admin@test.it',
    password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna', // this is === 123456
    delta: 0,
    role: SCOPES.ROLES.ADMIN.VALUE
  },
  {
    id: Buffer.from('Mock:George').toString('base64'),
    name: 'George',
    username: 'george',
    email: 'test@test.it',
    password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
    delta: 0,
    role: SCOPES.ROLES.USER.VALUE
  },
  {
    id: Buffer.from('Mock:Mike').toString('base64'),
    name: 'Mike',
    username: 'mike',
    email: 'mike@test.it',
    password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
    delta: 0,
    role: SCOPES.ROLES.STAFF.VALUE
  }
];
