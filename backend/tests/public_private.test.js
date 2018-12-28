import { tester } from 'graphql-tester-options';
import { SERVER } from '../src/config';
import { UNAUTHORIZED } from '../src/environment';


const {
  PORT,
  GRAPHQL,
  PROTOCOL,
  HOST,
} = SERVER;

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
});
