<template>
  <div v-loading="!authorized">
    <h1>{{ intro }}</h1>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">VueJs</a></li>
      <li><a href="https://www.apollographql.com/" target="_blank">Apollo Graphql</a></li>
      <li><a href="http://element.eleme.io/" target="_blank">Element UI</a></li>
    </ul>
  </div>
</template>

<script>
import { checkAuthQuery } from '../api';

export default {
  name: 'home',
  data() {
    return {
      intro: 'A basic connector for authentication/authorization',
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
