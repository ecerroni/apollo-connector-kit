import { authQuery } from '@/api';

export default {
  data() {
    return {
      authorized: false,
    };
  },
  apollo: {
    authorized: {
      query: authQuery,
      fetchPolicy: 'network-only',
      update({ _checkAuth }) {
        return typeof _checkAuth === 'string';
      },
    },
  },
};
