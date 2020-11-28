import { tester } from 'graphql-tester-options';
import decode from 'jwt-decode';
import { SERVER } from '../src/config';
// import { to, asyncArray } from '../src/utils';
import { ERROR } from '../src/environment';
import { deepFlatten } from '../src/utils'
import ROLES_PERMISSIONS from '../../settings/roles-permissions.json'


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

// USERS
describe('A user', function () {
  beforeAll(() => {
    this.test = tester({
      url: `${PROTOCOL}://${HOST}:${PORT}${GRAPHQL}`,
      contentType: 'application/json',
    });
  });
  it('should not login with wrong credentials', (done) => {
    this
      .test(
        JSON.stringify({
          query: loginQuery,
          variables: {
            userCredentials: {
              username: 'test',
              password: 'MTExMTEx',
            },
          },
        }),
        { jar: true },
      )
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(false);
        expect(res.errors[0].message).toBe(ERROR.USER.WRONG_CREDENTIALS);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should not login with wrong password', (done) => {
    this
      .test(
        JSON.stringify({
          query: loginQuery,
          variables: {
            userCredentials: {
              username: 'rico',
              password: 'MTExMTEx',
            },
          },
        }),
        { jar: true },
      )
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(false);
        expect(res.errors[0].message).toBe(ERROR.USER.WRONG_PASSWORD);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should not login with non encoded (base64) password', (done) => {
    this
      .test(
        JSON.stringify({
          query: loginQuery,
          variables: {
            userCredentials: {
              username: 'rico',
              password: '123456', // right password but not encoded (base64)
            },
          },
        }),
        { jar: true },
      )
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.success).toBe(false);
        expect(res.errors[0].message.includes('Value must be a non-empty Base64-encoded string')).toBe(true);
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
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should login with right credentials and limited rights', (done) => {
    this
      .test(
        JSON.stringify({
          query: loginQuery,
          variables: {
            userCredentials: {
              username: 'george',
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
        const { token } = JSON.parse(login);
        const decodedToken = decode(token);
        const { user: { roles, permissions } = {} } = decodedToken;
        expect(Array.isArray(permissions)).toBe(true);
        expect(Array.isArray(roles)).toBe(true);
        expect(roles).toHaveLength(1);
        const rightRoles = roles.includes('USER');
        expect(rightRoles).toBe(true);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
});
