import { tester } from 'graphql-tester-options';
import { SERVER } from '../src/config';

const { PORT, GRAPHQL, PROTOCOL, HOST } = SERVER;

const testTypesQuery = {
  JSON: `
    query testJSON {
      testJSON(where: [{ json: true }])
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

  it('should be valid JSON', done => {
    this.test(
      JSON.stringify({
        query: testTypesQuery.JSON
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
        expect(res.data.testJSON).toBe(true);
        done();
      })
      .catch(err => {
        expect(err).toBe(null);
        done();
      });
  });
});
