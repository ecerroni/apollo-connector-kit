import { tester } from 'graphql-tester-options';
import { SERVER } from '../src/config';

const { PORT, GRAPHQL, PROTOCOL, HOST } = SERVER;

const testConstraintsQuery = {
  minStringLengthIs3: `
    query testConstraint {
      testConstraint(input: { minStringLengthIs3: "aaa" })
    }
  `,
  wrongMinStringLengthIs3: `
    query testConstraint {
      testConstraint(input: { minStringLengthIs3: "bb" })
    }
  `
};

// USERS
describe('A user', function() {
  beforeAll(() => {
    this.test = tester({
      url: `${PROTOCOL}://${HOST}:${PORT}${GRAPHQL}`,
      contentType: 'application/json'
    });
  });

  it('should be valid input', done => {
    this.test(
      JSON.stringify({
        query:testConstraintsQuery.minStringLengthIs3
      }),
      {
        jar: true,
        headers: {
          'Content-Type': 'application/json',
          'x-connector-auth-request-type': 'LOCAL_STORAGE',
          'x-connector-token': null,
          'x-connector-refresh-token': null
        }
      }
    )
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        expect(!!res.data.testConstraint).toBe(true);
        done();
      })
      .catch(err => {
        expect(err).toBe(null);
        done();
      });
  });

  it('should be NOT valid input', done => {
    this.test(
      JSON.stringify({
        query:testConstraintsQuery.wrongMinStringLengthIs3
      }),
      {
        jar: true,
        headers: {
          'Content-Type': 'application/json',
          'x-connector-auth-request-type': 'LOCAL_STORAGE',
          'x-connector-token': null,
          'x-connector-refresh-token': null
        }
      }
    )
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.success).toBe(false);
        const { errors } = res;
        expect(Array.isArray(errors)).toBe(true);
        done();
      })
      .catch(err => {
        expect(err).toBe(null);
        done();
      });
  });
});
