import { AUTH } from '../config';

export const localAuthCheck = () => AUTH.ENDPOINT === 'localhost' || AUTH.ENDPOINT === '127.0.0.1' || AUTH.ENDPOINT === '0.0.0.0';
