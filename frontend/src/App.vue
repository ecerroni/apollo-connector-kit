<template>
  <div id="app" v-cloak>
    <transition
      appear
      appear-class="fade-enter"
      appear-to-class="fade"
      appear-active-class="fade-enter-active"
    >
      <div class="a">
        <top />
        <img class="logo" src="./assets/logo.png">
        <transition name="slide" mode="out-in">
          <router-view></router-view>
        </transition>
        <bottom />
      </div>
    </transition>
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
.a {
  display: flex;
  flex-direction: column;
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

[v-cloak] {
  display: none;
}

.fade-enter-active {
  transition: opacity .3s
}
.fade-enter {
  opacity: 0
}

.fade {

}

.slide-enter { transform: translateX(-100%); }
.slide-leave-to { opacity: 0; }
.slide-enter-to { transform: translateX(0) }
.slide-leave { transform: translateY(0) }

.slide-enter-active { transition: all 350ms ease-in-out }
.slide-leave-active { transition: all 150ms ease-in-out }

.logo {
  display: flex;
  align-self: center;
}
</style>
