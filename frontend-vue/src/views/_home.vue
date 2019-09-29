<template>
  <home-container v-show="authorized">
    <template
      #loading="{ loading }"
    >
      <span class="loader">Loading data | (Handle loading inside the view component using the template slot)</span>
    </template>
    <template #data="{ currentUser, staticData, loading, delay }">
      <home-controller
        :delay="delay"
        :loading="loading"
      >
        <template
          #default="{ isModalOpen, toggleModal }"
        >
          <home-view
            v-bind="{
              loading,
              currentUser,
              staticData,
              delay,
              isModalOpen,
              toggleModal,
              intro
            }"
          />
        </template>
      </home-controller>
    </template>
  </home-container>
</template>

<script>
import { apolloAuthentication } from "@/mixins";
import { Icon, Modal, HomeView, HomeContainer, HomeController } from '@/components'

export default {
  name: "Home",
  components: {
    HomeController,
    HomeContainer,
    HomeView
  },
  mixins: [
    apolloAuthentication
  ] /* call this only if there are no
  other apollo queries in the component that are not public and you want to protect this route
  anyway */,
  data() {
    return {
      intro: "A basic connector for authentication/authorization",
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1,
h2 {
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
.loader {
  background-color: #42b983;
  padding: .25em 1em;
  border-radius: 1em
}
</style>
