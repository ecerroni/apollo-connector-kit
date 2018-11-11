import { _checkAuthQuery } from '@/api';

export default {
  data() {
    return {
      authorized: false,
    };
  },
  apollo: {
    authorized: {
      query: _checkAuthQuery,
      fetchPolicy: 'network-only',
      update({ _checkAuth }) {
        return typeof _checkAuth === 'string';
      },
    },
  },
};
