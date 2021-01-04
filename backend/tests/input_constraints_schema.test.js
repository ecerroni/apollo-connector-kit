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

const testYupsQuery = {
  testInputValidationOnMutationNoArgs: `
    mutation testInputValidationOnMutation {
      testInputValidationOnMutation
    }
  `,
  testInputValidationOnMutationErrorYup: `
    mutation testInputValidationOnMutation {
      testInputValidationOnMutation(yup: 1)
    }
  `,
  testInputValidationOnMutationErrorText: `
    mutation testInputValidationOnMutation {
      testInputValidationOnMutation(yup: 3, text: "123")
    }
  `,
  testInputValidationOnMutationOk: `
    mutation testInputValidationOnMutation {
      testInputValidationOnMutation(yup: 3, text: "1234")
    }
  `,
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


  // YUP
  it('should be valid input yup', done => {
    this.test(
      JSON.stringify({
        query:testYupsQuery.testInputValidationOnMutationNoArgs
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
        console.log(res);
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        expect(!!res.data.testInputValidationOnMutation).toBe(true);
        expect(res.data.testInputValidationOnMutation.yup).toBe(3);
        done();
      })
      .catch(err => {
        expect(err).toBe(null);
        done();
      });
  });

  it('should be valid input yup + text', done => {
    this.test(
      JSON.stringify({
        query:testYupsQuery.testInputValidationOnMutationOk
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
        expect(!!res.data.testInputValidationOnMutation).toBe(true);
        expect(res.data.testInputValidationOnMutation.yup).toBe(3);
        expect(res.data.testInputValidationOnMutation.text).toBe('1234');
        done();
      })
      .catch(err => {
        expect(err).toBe(null);
        done();
      });
  });

  it('should NOT be valid input yup', done => {
    this.test(
      JSON.stringify({
        query:testYupsQuery.testInputValidationOnMutationErrorYup
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
        expect(res.status).toBe(422);
        expect(res.success).toBe(false);
        expect(!!res.data.testInputValidationOnMutation).toBe(false);
        done();
      })
      .catch(err => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should NOT be valid input yup', done => {
    this.test(
      JSON.stringify({
        query:testYupsQuery.testInputValidationOnMutationErrorText
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
        expect(res.status).toBe(422);
        expect(res.success).toBe(false);
        expect(!!res.data.testInputValidationOnMutation).toBe(false);
        done();
      })
      .catch(err => {
        expect(err).toBe(null);
        done();
      });
  });
});

