import { tester } from 'graphql-tester';
import decode from 'jwt-decode';
import { SERVER } from '../src/config';
// import { to, asyncArray } from '../src/utils';
import { ERROR, UNAUTHORIZED, FORBIDDEN, NOT_ALLOWED } from '../src/environment';


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
  query test {
    test
  }
`;

const privateAuthQuery = `
  query _checkAuth {
    _checkAuth
  }
`;

const testPermissionsQuery = {
  hasRole: `
    query testPermissions {
      testPermissionsHasRole
    }
  `,
  isAllowed: `
    query testPermissions {
      testPermissionsIsAllowed
    }
  `,
};

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
              password: 'wrongpass',
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
              username: 'ric0',
              password: 'wrongpass',
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
  it('should login with right credentials', (done) => {
    this
      .test(
        JSON.stringify({
          query: loginQuery,
          variables: {
            userCredentials: {
              username: 'ric0',
              password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', // 'this 123456' hashed
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
        expect(roles).toHaveLength(2);
        const rightRoles = roles.includes('ADMIN') && roles.includes('USER');
        expect(rightRoles).toBe(true);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
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
        const { data: { test = '' } = {} } = res;
        expect(test).toBe('Server is up and running... working smoothly');
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
        expect(res.status).toBe(200);
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
  it('should be NOT have permissions with hasRole', (done) => {
    this
      .test(
        JSON.stringify({
          query: testPermissionsQuery.hasRole,
        }),
        { jar: true },
      )
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(false);
        const { errors } = res;
        expect(Array.isArray(errors)).toBe(true);
        expect(res.errors[0].message).toBe(FORBIDDEN);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should be NOT have permissions with isAllowed', (done) => {
    this
      .test(
        JSON.stringify({
          query: testPermissionsQuery.isAllowed,
        }),
        { jar: true },
      )
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(false);
        const { errors } = res;
        expect(Array.isArray(errors)).toBe(true);
        expect(res.errors[0].message).toBe(NOT_ALLOWED);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
});
