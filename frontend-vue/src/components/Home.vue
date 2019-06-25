<template>
  <div v-show="authorized">
    <h1>{{ intro }}</h1>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >VueJs</a>
      </li>
      <li>
        <a
          href="https://www.apollographql.com/"
          target="_blank"
        >Apollo Graphql</a>
      </li>
      <li>
        <a
          href="http://element.eleme.io/"
          target="_blank"
        >Element UI</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { apolloAuthentication } from '@/mixins';

export default {
  name: 'Home',
  mixins: [apolloAuthentication], /* call this only if there are no
  other apollo queries in the component that are not public and you want to protect this route
  anyway */
  data() {
    return {
      intro: 'A basic connector for authentication/authorization',
    };
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
