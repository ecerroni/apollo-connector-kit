import { tester } from 'graphql-tester-options';
import decode from 'jwt-decode';
import { SERVER } from '../src/config';
import { UNAUTHORIZED } from '../src/environment';
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
const publicTestQuery = `
  query ping {
    ping
  }
`;

const privateAuthQuery = `
  query _testCheckAuthAdmin {
    _testCheckAuthAdmin
  }
`;

let sharedToken;
let sharedRefreshToken;

// USERS
describe('A user', function () {
  beforeAll(() => {
    this.test = tester({
      url: `${PROTOCOL}://${HOST}:${PORT}${GRAPHQL}`,
      contentType: 'application/json',
    });
  });
  it('should be allowed to call public queries', (done) => {
    this
      .test(
        JSON.stringify({
          query: publicTestQuery,
        }),
        { jar: true },
      )
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        const { data: { ping = '' } = {} } = res;
        expect(ping).toBe('Server is up and running... working smoothly');
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should be NOT allowed to call private queries', (done) => {
    this
      .test(
        JSON.stringify({
          query: privateAuthQuery,
        }),
        { jar: true },
      )
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.success).toBe(false);
        const { errors } = res;
        expect(Array.isArray(errors)).toBe(true);
        expect(res.errors[0].message).toBe(UNAUTHORIZED);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should login with right credentials and full rights', (done) => {
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
        { jar: true },
      )
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        const { data: { login = null } = {} } = res;
        expect(typeof login).toBe('string');
        const tokens = login.includes('token') && login.includes('refreshToken');
        expect(tokens).toBe(true);
        const { token, refreshToken } = JSON.parse(login);
        sharedToken = token;
        sharedRefreshToken = refreshToken;
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
            'Content-Type': 'application/json', 'x-connector-auth-request-type': 'LOCAL_STORAGE', 'x-connector-token': sharedToken, 'x-connector-refresh-token': sharedRefreshToken,
          },
        },
      )
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        expect(res.data._testCheckAuthAdmin).toBe('Authorized | CurentUserId 1!');
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
});
