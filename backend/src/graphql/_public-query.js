import { PUBLIC_PREFIX } from '#/common/strategies';

export default (query) => {
  Object.keys(query).forEach((name) => {
    if (name.includes(PUBLIC_PREFIX)) {
      Object.defineProperty(query[name], 'name', {
        value: name,
        configurable: true,
      });
    }
  });
};
