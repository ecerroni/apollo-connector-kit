import { tester } from 'graphql-tester-options';
import { SERVER } from '../src/config';
import { FORBIDDEN, NOT_ALLOWED } from '../src/environment';


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
  isAllowedField: `
    query users {
      users {
        email
      }
    }
  `,
};

let sharedToken;
let sharedRefreshToken;
let sharedRestrictedToken;
let sharedRestrictedRefreshToken;
// USERS
describe('A user', function () {
  beforeAll(() => {
    this.test = tester({
      url: `${PROTOCOL}://${HOST}:${PORT}${GRAPHQL}`,
      contentType: 'application/json',
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
        const { token, refreshToken } = JSON.parse(login);
        sharedToken = token;
        sharedRefreshToken = refreshToken;
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
        const { token, refreshToken } = JSON.parse(login);
        sharedRestrictedToken = token;
        sharedRestrictedRefreshToken = refreshToken;
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should have permissions with hasRole', (done) => {
    this
      .test(
        JSON.stringify({
          query: testPermissionsQuery.hasRole,
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
        expect(res.data.testPermissionsHasRole).toBe('ok role');
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should NOT have permissions with hasRole', (done) => {
    this
      .test(
        JSON.stringify({
          query: testPermissionsQuery.hasRole,
        }),
        {
          jar: true,
          headers: {
            'Content-Type': 'application/json', 'x-connector-auth-request-type': 'LOCAL_STORAGE', 'x-connector-token': sharedRestrictedToken, 'x-connector-refresh-token': sharedRestrictedRefreshToken,
          },
        },
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
  it('should have permissions with isAllowed', (done) => {
    this
      .test(
        JSON.stringify({
          query: testPermissionsQuery.isAllowed,
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
        expect(res.data.testPermissionsIsAllowed).toBe('ok permission');
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should NOT have permissions with isAllowed', (done) => {
    this
      .test(
        JSON.stringify({
          query: testPermissionsQuery.isAllowed,
        }),
        {
          jar: true,
          headers: {
            'Content-Type': 'application/json', 'x-connector-auth-request-type': 'LOCAL_STORAGE', 'x-connector-token': sharedRestrictedToken, 'x-connector-refresh-token': sharedRestrictedRefreshToken,
          },
        },
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
  it('should have permissions with isAllowed on Field', (done) => {
    this
      .test(
        JSON.stringify({
          query: testPermissionsQuery.isAllowedField,
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
        expect(res.data.users).toHaveLength(2);
        expect(res.data.users.filter(u => !!u.email)).toHaveLength(2);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should NOT have permissions with isAllowed on Field [Reutrn null for the field]', (done) => {
    this
      .test(
        JSON.stringify({
          query: testPermissionsQuery.isAllowedField,
        }),
        {
          jar: true,
          headers: {
            'Content-Type': 'application/json', 'x-connector-auth-request-type': 'LOCAL_STORAGE', 'x-connector-token': sharedRestrictedToken, 'x-connector-refresh-token': sharedRestrictedRefreshToken,
          },
        },
      )
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        expect(res.data.users).toHaveLength(2);
        expect(res.data.users.filter(u => !!u.email)).toHaveLength(0);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should NOT have permissions with isAllowed if not logged in at all', (done) => {
    this
      .test(
        JSON.stringify({
          query: testPermissionsQuery.isAllowed,
        }),
        {
          jar: true,
        },
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
