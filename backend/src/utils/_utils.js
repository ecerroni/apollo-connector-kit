import { auth } from '../config';

export const localAuth = () => auth.endpoint === 'localhost' || auth.endpoint === '127.0.0.1' || auth.endpoint === '0.0.0.0';
