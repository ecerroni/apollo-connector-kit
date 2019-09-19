import { dbSource } from './db';
import { apiSource } from './api';

export { UserHelper } from './db';

export const buildSource = {
  db: db => dbSource(db),
  api: () => apiSource()
};
