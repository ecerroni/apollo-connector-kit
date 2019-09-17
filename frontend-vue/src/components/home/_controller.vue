<template>
  <div>
    <slot
      v-bind="{
        isModalOpen,
        toggleModal,
      }"
    />
  </div>
</template>
<script>
export default {
  name: 'HomeController',
  props: {
    delay: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: true,
    };
  },
  computed: {
    isModalOpen() {
      return this.isOpen && this.delay > 0 && this.loading      
    },
  },
  methods: {
    toggleModal() {
      this.isOpen = !this.isOpen;
    },
  },
}
</script>