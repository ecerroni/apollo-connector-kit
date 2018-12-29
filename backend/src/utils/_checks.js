import QUERY_SETTINGS from '$/settings/queries.json';

const { PRIVATE_PREFIX } = QUERY_SETTINGS;
export default name => name.substring(0, PRIVATE_PREFIX.length) === PRIVATE_PREFIX;
