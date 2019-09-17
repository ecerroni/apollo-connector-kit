<template>
  <home-container v-show="authorized">
    <template
      #loading="{ loading }"
    >      
      <span class="loader">Loading data | (Handle loading inside the view component using the template slot)</span>
    </template>
    <template #data="{ data: { currentUser, staticData, loading } }">
      <h1>{{ intro }}</h1>
      <h2>Ecosystem</h2>
      <ul class="mb-8">
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
            href="https://tailwindcss.com/"
            target="_blank"
          >Tailwindcss</a>
        </li>
      </ul>
      <div class="mb-8">
        <icon
          name="home"
          color="black"
          size="4"
        />
      </div>
      <hr>
      <span>v-if="loading" + v-else inside the data template</span>
      <hr>
      <div v-if="loading">
        <span class="loader">Loading data | (Handle loading inside the view component)</span>
      </div>
      <div v-else>
        <p v-if="!loading">
          Dynamic Data: {{ currentUser.name }} | {{ !!currentUser && currentUser.id ? 'OK' : 'ERR' }}
        </p>
        <p>Static Data: {{ staticData }} | {{ staticData === 'test' ? 'OK' : 'ERR' }}</p>
      </div>
      <br>
      <br>
      <br>
      <hr>
      <span>v-if="loading", no v-else, in spefic html tag</span>
      <hr>
      <div>
        <p>
          Dynamic Data: {{ currentUser.name }} | <span :class="loading && 'loader'">{{ loading ? 'loading...' : !!currentUser && currentUser.id ? 'OK' : 'ERR' }}</span>
        </p>
        </p><p>Static Data: {{ staticData }} | {{ staticData === 'test' ? 'OK' : 'ERR' }}</p>
      </div>
    </template>
  </home-container>
</template>

<script>
import { apolloAuthentication } from "@/mixins";
import { HomeContainer } from '@/containers'
import { Icon } from '@/components'
export default {
  name: "Home",
  components: {
    HomeContainer,
    Icon
  },
  mixins: [
    apolloAuthentication
  ] /* call this only if there are no
  other apollo queries in the component that are not public and you want to protect this route
  anyway */,
  data() {
    return {
      intro: "A basic connector for authentication/authorization"
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
