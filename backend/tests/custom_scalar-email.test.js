import { tester } from 'graphql-tester-options';
import { SERVER } from '../src/config';


const {
  PORT,
  GRAPHQL,
  PROTOCOL,
  HOST,
} = SERVER;

const emailTestQuery = `
  query testEmailScalar {
    testEmailScalar
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
  it('should return an email', (done) => {
    this
      .test(
        JSON.stringify({
          query: emailTestQuery,
        }),
        { jar: true },
      )
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        const { data: { testEmailScalar: test = '' } = {} } = res;
        expect(test).toBe('info@test.com');
        done();
      })
      .catch((err) => {
        expect(err).toBe(null);
        done();
      });
  });
});
