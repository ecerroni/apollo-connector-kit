<template>
  <div id="app">
    <header />
    <img src="./assets/logo.png">
    <router-view></router-view>
    <footer />
  </div>
</template>

<script>
export default {
  name: 'app',
};
// TODO: ADD BASIC STYLING FOR ROOT APP (FLEXBOX + GRID LAYOUT)
</script>

<style>
#app  {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  text-align: center;
  color: #2c3e50;
}
</style>
