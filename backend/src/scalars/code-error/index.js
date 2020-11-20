export default class CodeError extends Error {
  constructor(code, message) {
    super();

    this.name = 'CodeError';
    this.code = code;
    this.message = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CodeError);
    } else {
      this.stack = new Error().stack;
    }
  }
}
