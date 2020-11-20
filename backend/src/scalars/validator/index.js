/* eslint-disable */
import CodeError from '../code-error';
import constants from './constants';

class Validator {
  constructor() {}

  get Validator() {
    return Validator;
  }

  isEqual(value1, value2) {
    return value1 == value2;
  }

  isStrictEqual(value1, value2) {
    return value1 === value2;
  }

  isType(value, type) {
    return this.isEqual(typeof value, type);
  }

  isClass(value, name) {
    return this.isEqual(
      Object.prototype.toString.call(value),
      `[object ${name}]`
    );
  }

  isInstance(value, constructor) {
    try {
      return value instanceof constructor;
    } catch (e) {
      return false;
    }
  }

  isUndefined(value) {
    return this.isType(value, 'undefined');
  }

  isNull(value) {
    return this.isStrictEqual(value, null);
  }

  isNil(value) {
    return this.isEqual(value, null);
  }

  isObject(value) {
    return (
      !this.isNull(value) &&
      (this.isType(value, 'object') || this.isFunction(value))
    );
  }

  isObjectLike(value) {
    return !this.isNull(value) && this.isType(value, 'object');
  }

  isPlainObject(value) {
    return this.isClass(value, 'Object');
  }

  isFunction(value) {
    return this.isType(value, 'function');
  }

  isAsyncFunction(value) {
    return this.isClass(value, 'AsyncFunction');
  }

  isBoolean(value) {
    return this.isType(value, 'boolean') || this.isClass(value, 'Boolean');
  }

  isNumber(value) {
    return this.isType(value, 'number') || this.isClass(value, 'Number');
  }

  isString(value) {
    return this.isType(value, 'string') || this.isClass(value, 'String');
  }

  isSymbol(value) {
    return this.isType(value, 'symbol') || this.isClass(value, 'Symbol');
  }

  isArray(value) {
    return Array.isArray(value);
  }

  isBuffer(value) {
    return Buffer.isBuffer(value);
  }

  isArrayBuffer(value) {
    return this.isInstance(value, ArrayBuffer);
  }

  isRegExp(value) {
    return this.isInstance(value, RegExp);
  }

  isSet(value) {
    return this.isInstance(value, Set);
  }

  isMap(value) {
    return this.isInstance(value, Map);
  }

  isPromise(value) {
    return this.isInstance(value, Promise);
  }

  isDate(value) {
    return this.isInstance(value, Date);
  }

  isError(value) {
    return this.isInstance(value, Error);
  }

  isTypeError(value) {
    return this.isInstance(value, TypeError);
  }

  isCodeError(value) {
    return this.isInstance(value, CodeError);
  }

  isNaN(value) {
    return this.isNumber(value) && global.isNaN(value);
  }

  isFinite(value) {
    return this.isNumber(value) && global.isFinite(value);
  }

  isInteger(value) {
    return this.isFinite(value) && !(value % 1);
  }

  isSafeInteger(value) {
    return (
      this.isInteger(value) &&
      this.isRange(value, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    );
  }

  isFloat(value) {
    return this.isFinite(value);
  }

  isDecimal(value) {
    return this.isFinite(value) && !!(value % 1);
  }

  isInfinity(value) {
    return this.isStrictEqual(Math.abs(value), Infinity);
  }

  isMore(value, number) {
    return value > number;
  }

  isLess(value, number) {
    return value < number;
  }

  isMoreEqual(value, number) {
    return value >= number;
  }

  isLessEqual(value, number) {
    return value <= number;
  }

  isRange(value, min, max) {
    return this.isMoreEqual(value, min) && this.isLessEqual(value, max);
  }

  isPositive(value) {
    return this.isMore(value, 0);
  }

  isNegative(value) {
    return this.isLess(value, 0);
  }

  isNonNegative(value) {
    return this.isMoreEqual(value, 0);
  }

  isNonPositive(value) {
    return this.isLessEqual(value, 0);
  }

  isPositiveInteger(value) {
    return this.isInteger(value) && this.isPositive(value);
  }

  isPositiveFloat(value) {
    return this.isFloat(value) && this.isPositive(value);
  }

  isNegativeInteger(value) {
    return this.isInteger(value) && this.isNegative(value);
  }

  isNegativeFloat(value) {
    return this.isFloat(value) && this.isNegative(value);
  }

  isNonNegativeInteger(value) {
    return this.isInteger(value) && this.isNonNegative(value);
  }

  isNonNegativeFloat(value) {
    return this.isFloat(value) && this.isNonNegative(value);
  }

  isNonPositiveInteger(value) {
    return this.isInteger(value) && this.isNonPositive(value);
  }

  isNonPositiveFloat(value) {
    return this.isInteger(value) && this.isNonPositive(value);
  }

  isNatural(value) {
    return this.isNonNegativeInteger(value);
  }

  isPositiveDecimal(value) {
    return this.isDecimal(value) && this.isPositive(value);
  }

  isNegativeDecimal(value) {
    return this.isDecimal(value) && this.isNegative(value);
  }

  isEven(value) {
    return this.isInteger(value) && !(value % 2);
  }

  isOdd(value) {
    return this.isInteger(value) && !!(value % 2);
  }

  isTrue(value) {
    return this.isStrictEqual(value, true);
  }

  isFalse(value) {
    return this.isStrictEqual(value, false);
  }

  isRegex(value, regex) {
    return this.isRegExp(regex)
      ? regex.test(value)
      : this.isPattern(regex) && new RegExp(regex).test(value);
  }

  isExists(value) {
    return !this.isNil(value);
  }

  isEmptyString(value) {
    return this.isString(value) && !value;
  }

  isNonEmptyString(value) {
    return this.isString(value) && !!value;
  }

  isEmptyArray(value) {
    return this.isArray(value) && !value.length;
  }

  isNonEmptyArray(value) {
    return this.isArray(value) && !!value.length;
  }

  isKey(value) {
    return (
      this.isNonEmptyString(value) ||
      this.isBuffer(value) ||
      this.isObjectLike(value)
    );
  }

  isLength(value, ...args) {
    if (
      this.isString(value) ||
      this.isArray(value) ||
      this.isBuffer(value) ||
      this.isArrayBuffer(value)
    ) {
      const length = value.length || value.byteLength;
      if (args.length) {
        if (args.length > 1) return this.isRange(length, ...args);
        const [options] = args;
        if (this.isPlainObject(options)) {
          const { min, max } = options;
          if (options.hasOwnProperty('min') && options.hasOwnProperty('max'))
            return this.isRange(length, min, max);
          if (options.hasOwnProperty('min'))
            return this.isMoreEqual(length, min);
          if (options.hasOwnProperty('max'))
            return this.isLessEqual(length, max);
          return false;
        }
        return this.isStrictEqual(length, ...args);
      }
      return !!length;
    }
    return false;
  }

  isSize(value, ...args) {
    if (this.isObjectLike(value)) {
      const size =
        this.isSet(value) || this.isMap(value)
          ? value.size
          : Object.keys(value).length;
      if (args.length) {
        if (args.length > 1) return this.isRange(size, ...args);
        const [options] = args;
        if (this.isPlainObject(options)) {
          const { min, max } = options;
          if (options.hasOwnProperty('min') && options.hasOwnProperty('max'))
            return this.isRange(size, min, max);
          if (options.hasOwnProperty('min')) return this.isMoreEqual(size, min);
          if (options.hasOwnProperty('max')) return this.isLessEqual(size, max);
          return false;
        }
        return this.isStrictEqual(size, ...args);
      }
      return !!size;
    }
    return false;
  }

  isEmpty(value) {
    return !this.isLength(value) && !this.isSize(value);
  }

  isHas(value, key) {
    if (this.isObjectLike(value)) {
      if (this.isArray(value) || this.isSet(value))
        return this.isRange(key, 0, (value.length || value.size) - 1);
      if (this.isMap(value)) return value.has(key);
      return value.hasOwnProperty(key);
    }
    return false;
  }

  isIncludes(value, element) {
    if (this.isObjectLike(value)) {
      if (this.isArray(value)) return value.includes(element);
      if (this.isSet(value)) return value.has(element);
      if (this.isMap(value))
        return [...value].some(([key, value]) => value === element);
      return Object.values(value).includes(element);
    }
    return false;
  }

  isUnique(value) {
    if (this.isObjectLike(value)) {
      if (this.isArray(value))
        return this.isEqual(value.length, [...new Set(value)].length);
      if (this.isSet(value)) return true;
      if (this.isMap(value))
        return this.isEqual(value.size, [...new Set([...value])].length);
      const values = Object.values(value);
      return this.isEqual(values.length, [...new Set(values)].length);
    }
    if (this.isString(value))
      return this.isEqual(value.length, [...new Set(value)].length);
    return false;
  }

  isJSON(value) {
    try {
      return !!JSON.parse(value);
    } catch (e) {
      return false;
    }
  }

  isJson(...args) {
    return this.isJSON(...args);
  }

  isPattern(value) {
    try {
      return this.isString(value) && !!new RegExp(value);
    } catch (e) {
      return false;
    }
  }

  isTimestamp(value) {
    return (
      this.isNumber(value) && this.isRegex(value, constants.TIMESTAMP_PATTERN)
    );
  }

  isUnixTimestamp(value) {
    return (
      this.isNumber(value) &&
      this.isRegex(value, constants.UNIX_TIMESTAMP_PATTERN)
    );
  }

  isMillisUnixTimestamp(value) {
    return (
      this.isNumber(value) &&
      this.isRegex(value, constants.MILLIS_UNIX_TIMESTAMP_PATTERN)
    );
  }

  isUUID(value) {
    return this.isString(value) && this.isRegex(value, constants.UUID_PATTERN);
  }

  isUuid(...args) {
    return this.isUUID(...args);
  }

  isIPv4(value) {
    return this.isString(value) && this.isRegex(value, constants.IPV4_PATTERN);
  }

  isPort(value) {
    return this.isNumber(value) && this.isRegex(value, constants.PORT_PATTERN);
  }

  isHTTP(value) {
    return this.isString(value) && this.isRegex(value, constants.HTTP_PATTERN);
  }

  isHttp(...args) {
    return this.isHTTP(...args);
  }

  isHTTPS(value) {
    return this.isString(value) && this.isRegex(value, constants.HTTPS_PATTERN);
  }

  isHttps(...args) {
    return this.isHTTPS(...args);
  }

  isDomain(value) {
    return (
      this.isString(value) && this.isRegex(value, constants.DOMAIN_PATTERN)
    );
  }

  isURL(value) {
    return this.isString(value) && this.isRegex(value, constants.URL_PATTERN);
  }

  isUrl(...args) {
    return this.isURL(...args);
  }

  isDomainURL(value) {
    return (
      this.isString(value) && this.isRegex(value, constants.DOMAIN_URL_PATTERN)
    );
  }

  isDomainUrl(...args) {
    return this.isDomainURL(...args);
  }

  isEmail(value) {
    return this.isString(value) && this.isRegex(value, constants.EMAIL_PATTERN);
  }

  isPhoneNumber(value) {
    return (
      this.isString(value) &&
      this.isRegex(value, constants.PHONE_NUMBER_PATTERN)
    );
  }

  isASCII(value) {
    return this.isString(value) && this.isRegex(value, constants.ASCII_PATTERN);
  }

  isAscii(...args) {
    return this.isASCII(...args);
  }

  isBase64(value) {
    return (
      this.isString(value) && this.isRegex(value, constants.BASE64_PATTERN)
    );
  }

  isBase64URL(value) {
    return (
      this.isString(value) && this.isRegex(value, constants.BASE64_PATTERN)
    );
  }

  isBase64Url(value) {
    return this.isBase64URL(value);
  }

  isBase58(value) {
    return (
      this.isString(value) && this.isRegex(value, constants.BASE58_PATTERN)
    );
  }

  isJWT(value) {
    return this.isString(value) && this.isRegex(value, constants.JWT_PATTERN);
  }

  isJwt(...args) {
    return this.isJWT(...args);
  }

  isAuthJWT(value) {
    return (
      this.isString(value) && this.isRegex(value, constants.AUTH_JWT_PATTERN)
    );
  }

  isAuthJwt(...args) {
    return this.isAuthJWT(...args);
  }
}

export default new Validator();
