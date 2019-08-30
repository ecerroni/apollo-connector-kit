<template>
  <component
    :is="iconPath(name)"
    :class="`fill-current text-${color} inline-block w-${size} h-${size}`"
  />
</template>

<script>
// use Heroicons https://www.heroicons.com/
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'black'
    },
    size: {
      type: String || Number,
      default: 8
    }
  },
  data() {
    return {
      iconSVG: null
    };
  },
  methods: {
    iconPath(name) {
      return require(`@/assets/icons/${name}.svg`).default;
    }
  }
};
</script>