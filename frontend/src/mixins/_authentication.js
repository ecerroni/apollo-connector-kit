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
      update({ checkAuth }) {
        return typeof checkAuth === 'string';
      },
    },
  },
};
