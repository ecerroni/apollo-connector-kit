<template>
  <div class="hello">
    <h1>{{ intro }}</h1>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">VueJs</a></li>
      <li><a href="https://www.apollographql.com/" target="_blank">Apollo Graphql</a></li>
    </ul>
  </div>
</template>

<script>
// TODO: ADD LOGIN COMPONENT FOR BOTH LOCALSTORAGE AND HTTP COOKIE STRATEGY (USE AXIOS)
export default {
  name: 'home',
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
