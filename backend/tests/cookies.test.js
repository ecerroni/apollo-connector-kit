import { tester } from 'graphql-tester-options';
import decode from 'jwt-decode';
import { SERVER } from '../src/config';
// import { to, asyncArray } from '../src/utils';
import ROLES_PERMISSIONS from '../../settings/roles-permissions.json'
import { deepFlatten } from '../src/utils';


const {
  PORT,
  GRAPHQL,
  PROTOCOL,
  HOST,
} = SERVER;

const loginQuery = `
mutation login ($userCredentials: userCredentials!) {
  login(input: $userCredentials)
}`;

const privateAuthQuery = `
  query _checkAuth {
    _checkAuth
  }
`;

// USERS
describe('A user', function () {
  beforeAll(() => {
    this.test = tester({
      url: `${PROTOCOL}://${HOST}:${PORT}${GRAPHQL}`,
      contentType: 'application/json',
    });
  });
  it('should login with HTTP_ONLY strategy, right credentials and full rights', (done) => {
    this
      .test(
        JSON.stringify({
          query: loginQuery,
          variables: {
            userCredentials: {
              username: 'rico',
              password: 'MTIzNDU2', // 'this 123456' encoded (base64). It'll be '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' hashed
            },
          },
        }),
        {
          jar: true,
          headers: {
            'Content-Type': 'application/json', 'x-connector-auth-request-type': 'HTTP_ONLY',
          },
        },
      )
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        const { data: { login = null } = {} } = res;
        expect(typeof login).toBe('string');
        const tokens = login.includes('token') && login.includes('refreshToken');
        expect(tokens).toBe(true);
        const { token } = JSON.parse(login);
        const decodedToken = decode(token);
        const { user: { roles, permissions } = {} } = decodedToken;
        expect(Array.isArray(permissions)).toBe(true);
        expect(Array.isArray(roles)).toBe(true);
        expect(roles).toHaveLength(deepFlatten(ROLES_PERMISSIONS.USERS).reduce((count, user) => {
          if (Array.isArray(user)) return count + user.length
          return count + 1
        }, 0));
        const rightRoles = roles.includes('ADMIN') && roles.includes('USER');
        expect(rightRoles).toBe(true);
        expect(res.headers['set-cookie'].length > 0).toBe(true);
        expect(res.headers['set-cookie'].toString().includes('x-connector-token=')).toBe(true);
        expect(res.headers['set-cookie'].toString().includes(',x-connector-refresh-token=')).toBe(true);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should be allowed to call private queries', (done) => {
    this
      .test(
        JSON.stringify({
          query: privateAuthQuery,
        }),
        {
          jar: true,
          headers: {
            'Content-Type': 'application/json', 'x-connector-auth-request-type': 'HTTP_ONLY',
          },
        },
      )
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
});
