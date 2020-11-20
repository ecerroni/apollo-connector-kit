/* eslint-disable max-len */
const BASE58_ALPHABET =
  'AveDarkwo1f23456789BCEFGHJKLMNPQRSTUVWXYZbcdghijmnpqstuxyz';
const TIMESTAMP_PATTERN = '^[1-9]\\d{11,12}$';
const UNIX_TIMESTAMP_PATTERN = '^[1-9]\\d{8,9}$';
const MILLIS_UNIX_TIMESTAMP_PATTERN = '^[1-9]\\d{8,9}(.\\d{1,3})?$';
const UUID_PATTERN =
  '^[a-f\\d]{8}-[a-f\\d]{4}-[a-f\\d]{4}-[a-f\\d]{4}-[a-f\\d]{12}$';
const IPV4_PATTERN =
  '^((\\d|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])$';
const PORT_PATTERN =
  '^([1-9]\\d{0,3}|[1-5]\\d{4}|6[0-4]\\d{3}|65[0-4]\\d{2}|655[0-2]\\d{1}|6553[0-5])$';
const HTTP_PATTERN = '^http://';
const HTTPS_PATTERN = '^https://';
const DOMAIN_PATTERN = '^(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}$';
const URL_PATTERN =
  '^https?://(((\\d|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])|(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})(:([1-9]\\d{0,3}|[1-5]\\d{4}|6[0-4]\\d{3}|65[0-4]\\d{2}|655[0-2]\\d{1}|6553[0-5]))?(/[\\w-.%+@&:~]*)*(\\?[\\w-.%+@&=:;,~]*)?(#[\\w-]*)?$';
const DOMAIN_URL_PATTERN =
  '^https?://(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}(/[\\w-.%+@&:~]*)*(\\?[\\w-.%+@&=:;,~]*)?(#[\\w-]*)?$';
const EMAIL_PATTERN =
  '^[\\w-.]+@(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}$';
const PHONE_NUMBER_PATTERN = '^\\+[1-9]\\d{6,14}$';
const ASCII_PATTERN = '^[ -~]+$';
const BASE64_PATTERN =
  '^([A-Za-z\\d+/]{4}|([A-Za-z\\d+/]{3}=|[A-Za-z\\d+/]{2}==)|([A-Za-z\\d+/]{4})+([A-Za-z\\d+/]{3}=|[A-Za-z\\d+/]{2}==)?)$';
const BASE64URL_PATTERN = '^[\\w-]+$';
const BASE58_PATTERN =
  '^[AveDarkwo1f23456789BCEFGHJKLMNPQRSTUVWXYZbcdghijmnpqstuxyz]+$';
const JWT_PATTERN = '^[\\w-]+\\.[\\w-]+\\.[\\w-]*$';
const AUTH_JWT_PATTERN = '^Bearer ([\\w-]+\\.[\\w-]+\\.[\\w-]+)$';

export default {
  BASE58_ALPHABET,
  TIMESTAMP_PATTERN,
  UNIX_TIMESTAMP_PATTERN,
  MILLIS_UNIX_TIMESTAMP_PATTERN,
  UUID_PATTERN,
  IPV4_PATTERN,
  PORT_PATTERN,
  HTTP_PATTERN,
  HTTPS_PATTERN,
  DOMAIN_PATTERN,
  URL_PATTERN,
  DOMAIN_URL_PATTERN,
  EMAIL_PATTERN,
  PHONE_NUMBER_PATTERN,
  ASCII_PATTERN,
  BASE64_PATTERN,
  BASE64URL_PATTERN,
  BASE58_PATTERN,
  JWT_PATTERN,
  AUTH_JWT_PATTERN
};
