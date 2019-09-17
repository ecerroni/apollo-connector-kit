<template>
  <div
    v-cloak
    id="app"
  >
    <notifications group="default" />
    <notifications
      group="errors"
      position="bottom center"
      width="100%"
    />
    <transition
      appear
      appear-class="fade-enter"
      appear-to-class="fade"
      appear-active-class="fade-enter-active"
    >
      <Layout>
        <Top
          slot="header"
        />
        <div slot="body">
          <img
            class="logo"
            src="./assets/logo.png"
          >
          <transition
            name="slide"
            mode="out-in"
          >
            <router-view />
          </transition>
        </div>
        <Bottom slot="footer" />
      </Layout>
    </transition>
  </div>
</template>

<script>
import { Header, Footer, Layout } from "@/components/layout";
export default {
  name: "App",
  components: {
    Layout,
    Top: Header,
    Bottom: Footer
  }
};
// TODO: ADD BASIC STYLING FOR ROOT APP (FLEXBOX + GRID LAYOUT)
</script>

<style>
@import "./assets/styles/tailwind.postcss";
html,
body {
  margin: 0;
}
#app {
  display: flex;
  flex: 1;
  height: 100vh;
  flex-flow: column;
  justify-content: space-between;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

[v-cloak] {
  display: none;
}

.fade-enter-active {
  transition: opacity 0.3s;
}
.fade-enter {
  opacity: 0;
}

.fade {
}

.slide-enter {
  transform: translateX(-100%);
}
.slide-leave-to {
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave {
  transform: translateY(0);
}

.slide-enter-active {
  transition: all 350ms ease-in-out;
}
.slide-leave-active {
  transition: all 150ms ease-in-out;
}

.logo {
  display: flex;
  align-self: center;
  margin: 0 auto;
}

@media only screen and (max-width: 767px) {
  .logo {
    display: none;
  }
}
</style>
<style lang="postcss">
.vue-notification {
  padding: 10px;
  margin: 0 5px 5px;

  font-size: 1.3em;

  color: #ffffff;
  background: #44a4fc;
  border-left: 5px solid #187fe7;

  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }

  &.error {
    background: #e54d42;
    border-left-color: #b82e24;
  }

  &.success {
    background: #68cd86;
    border-left-color: #42a85f;
  }
}
.formly-input {
  @apply flex flex-wrap h-24 leading-loose text-lg shadow appearance-none border rounded w-full my-2 p-3 text-gray-700 leading-tight;
  height: auto;
}
.formly-input > label {
  margin-right: 1em;
}
.formly-input input:focus {
  outline: none;
}
.formly-input > input {
  @apply w-full;
}
.formly-input:focus-within {
  border: 1px solid gold;
}
.formly-input.has-error > span {
  color: darkred;
  font-size: 0.7em;
}
.formly-input.has-error {
  border: 1px solid red;
}
.required-input > label:after {
  content: "*";
  padding-left: 0.2em;
  color: darkred;
}
</style>
