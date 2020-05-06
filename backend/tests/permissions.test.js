import { tester } from 'graphql-tester-options';
import decode from 'jwt-decode'
import { SERVER } from '../src/config';
import { FORBIDDEN, NOT_ALLOWED } from '../src/environment';
import { mockUsers } from '../src/mocks/_users'
import ROLES_PERMISSIONS from '../src/config/_roles-permissions'

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

const privateAuthQuery = `
  query _checkAuth {
    _checkAuth
  }
`;

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
        expect(res.status).toBe(403);
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
        console.log(err);
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
        expect(res.data.users.filter(u => !!u.email)).toHaveLength(mockUsers.length);
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should NOT have permissions with isAllowed on Field [Return null for the field and response status 200]', (done) => {
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
        expect(res.data.users).toHaveLength(mockUsers.length);
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
  it('should NOT be allowed to call private queries [Return FORBIDDEN]', (done) => {
    this
      .test(
        JSON.stringify({
          query: privateAuthQuery,
        }),
        {
          jar: true,
          headers: {
            'Content-Type': 'application/json', 'x-connector-auth-request-type': 'LOCAL_STORAGE', 'x-connector-token': sharedRestrictedToken, 'x-connector-refresh-token': sharedRestrictedRefreshToken,
          },
        },
      )
      .then((res) => {
        expect(res.status).toBe(403);
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

  it('should inherit lower rank roles', (done) => {
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
        const { user: { roles } } = decode(sharedToken)
        const allRoles = Object.keys(ROLES_PERMISSIONS).filter(role => role !== 'OWNER')
        expect(roles).toHaveLength(allRoles.length)
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should inherit lower rank permissions', (done) => {
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
        const { user: { permissions } } = decode(sharedToken)

        const allPermissions = Object.entries(ROLES_PERMISSIONS).filter(([role]) => role !== 'OWNER').reduce((arr, [key, value]) => [...arr, ...Object.entries(value.PERMISSIONS).reduce((a, [k, v]) => [...a, ...v.map(i => `${k}_${i}`)], [])], [])

        expect(permissions).toHaveLength(Array.from(new Set(allPermissions)).length)
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
});
