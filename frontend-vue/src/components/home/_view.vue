<template>
  <div>
    <Modal
      :show-modal="isModalOpen"
      :delay="delay"
      @toggleModal="toggleModal"
    />
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
      <li>
        <a
          href="https://github.com/jakesgordon/javascript-state-machine"
          target="_blank"
        >Javascript State Machine</a>
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
      <p>Static Data: {{ staticData }} | {{ staticData === 'test' ? 'OK' : 'ERR' }}</p>
    </div>
  </div>
</template>

<script>
import { Icon, Modal } from '@/components'

export default {
  components: {
    Icon,
    Modal,
  },
  props: {
    isModalOpen: Boolean,
    toggleModal: Function,
    currentUser: Object,
    staticData: String,
    delay: Number,
    loading: Boolean,
    intro: String,
  },
}
</script>