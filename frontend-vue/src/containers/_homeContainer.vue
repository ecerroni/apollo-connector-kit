
<template>
  <div>
    <slot>
      <div class="w-full flex flex-col items-center mt-12 justify-center bg-teal-lightest font-sans">
        <div
          v-if="delay > 0 && $apollo.loading"
          class="h-screen w-full absolute flex items-start justify-center bg-modal opacity-90"
        >
          <div class="bg-white rounded shadow p-8 m-4 max-w-xs max-h-full text-center overflow-y-scroll">
            <div class="mb-4">
              <h1>Delay is active</h1>
            </div>
            <div class="mb-8">
              <p>This is only a demo to show some options about how loading data can be handled</p>
            </div>
            <div class="flex justify-center">
              <button class="flex-no-shrink text-black py-2 px-4 rounded bg-teal hover:bg-teal-dark">
                Current Api Delay: {{ delay }}ms
              </button>
            </div>
            <p class="text-xs">
              (change it in `frontend-vue/src/containers/_homeContainer.vue`)
            </p>
          </div>
        </div>
      </div>
    </slot>
    <slot
      v-if="$apollo.loading && hasLoadingSlot"
      name="loading"
      :loading="$apollo.loading"
    >
      Loading...
    </slot>
    <slot
      name="data"
      :data="{ currentUser, staticData, loading: $apollo.loading }"
    />
  </div>
</template>

<script>
import {currentUserQuery} from '@/api'
export default {
  name: 'CurrentUser',
  // props: ['varName'],
  data () {
    return {
      currentUser: {},
      staticData: 'test',
      delay: 5000,
    }
  },
  computed: {
    hasLoadingSlot() {
      return this.$scopedSlots['loading']
    },
  },
  apollo: {
    currentUser() {
      return {
        query: currentUserQuery,
        variables() {
          return {
            delay: this.delay
          }
        },
      }
    }
  }
}
</script>