import { AUTH_QUERY } from '@/api';

export default {
  data() {
    return {
      authorized: false,
    };
  },
  apollo: {
    authorized: {
      query: AUTH_QUERY,
      fetchPolicy: 'network-only',
      update({ _checkAuth }) {
        return typeof _checkAuth === 'string';
      },
    },
  },
};
