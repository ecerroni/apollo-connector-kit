import hash from 'hash.js';

const hashString = text => ({
  digest: hash
    .sha256()
    .update(text)
    .digest('hex'),
  algorithm: 'sha-256'
});

export default hashString;
