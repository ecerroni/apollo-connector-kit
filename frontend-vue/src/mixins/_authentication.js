import { checkAuthQuery } from '@/api';

export default {
  data() {
    return {
      authorized: false,
    };
  },
  apollo: {
    authorized: {
      query: checkAuthQuery,
      fetchPolicy: 'network-only',
      update({ checkAuth }) {
        return typeof checkAuth === 'string';
      },
    },
  },
};
