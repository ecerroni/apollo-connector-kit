import bcrypt from 'bcrypt';

const encryptor = {
  verify: async ({ digest }, stored) => bcrypt.compare(digest, stored),
  encrypt: async ({ digest }) => bcrypt.hash(digest, 12),
};

export default encryptor;
