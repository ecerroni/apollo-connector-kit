<template>
  <div class="w-full flex flex-col items-center mt-12 justify-center bg-teal-lightest font-sans">
    <div
      v-if="show"
      class="h-screen w-full absolute flex items-start justify-center bg-modal opacity-90"
    >
      <div class="bg-white rounded shadow p-8 m-4 max-w-md max-h-full text-center overflow-y-hidden">
        <div class="mb-4">
          <h1>Delay is active</h1>
        </div>
        <div class="mb-8">
          <p>This is only a demo to show some options about how loading data can be handled</p>
        </div>
        <div class="flex justify-center flex-col">
          <p>
            Current Api Delay: {{ delay }}ms
          </p>
          <button
            class="flex-no-shrink text-black py-2 px-4 rounded bg-green-700 hover:bg-green-300"
            @click="$emit('toggleModal')"
          >
            Close
          </button>
        </div>
        <p class="text-xs">
          (change it in `frontend-vue/src/containers/_homeContainer.vue`)
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    delay: {
      type: Number,
      default: 0
    },
  },
  computed: {
    show() {
      return this.showModal
    }
  },
}
</script>