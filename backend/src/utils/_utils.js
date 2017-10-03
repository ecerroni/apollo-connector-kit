import { auth } from '../config';

export const localAuth = () => {
  return auth.endpoint === 'localhost' || auth.endpoint === '127.0.0.1' || auth.endpoint === '0.0.0.0'
}