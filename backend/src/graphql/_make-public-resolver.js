import QUERY_SETTINGS from '$/settings/queries.json';

const { PUBLIC_PREFIX = 'public' } = QUERY_SETTINGS;

export default (resolverName = 'noName') => {
  const name = resolverName;
  if (typeof resolverName === 'string') {
    if (resolverName.length > 1) {
      return `${PUBLIC_PREFIX}${name[0].toUpperCase()}${name.slice(1)}`;
    }
    return `${PUBLIC_PREFIX}${name[0].toUpperCase()}`;
  }
  return null;
};
