<template>
  <div id="app">
    <top />
    <img class="logo" src="./assets/logo.png">
    <router-view></router-view>
    <bottom />
  </div>
</template>

<script>
import { Top, Bottom } from '@/components/layout';

export default {
  name: 'app',
  components: { Top, Bottom },
};
// TODO: ADD BASIC STYLING FOR ROOT APP (FLEXBOX + GRID LAYOUT)
</script>

<style>
html, body {
  margin: 0;
}
#app  {
  display: flex;
  height: 100vh;
  flex-flow: column;
  justify-content: space-between;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.logo {
  display: flex;
  align-self: center;
}
</style>
