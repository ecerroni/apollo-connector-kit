
<template>
  <div>
    <slot
      v-if="$apollo.loading && hasLoadingSlot"
      name="loading"
      :loading="$apollo.loading"
    >
      Loading...
    </slot>
    <slot
      name="data"
      v-bind="{ currentUser, staticData, loading: $apollo.loading, delay }"
    />
  </div>
</template>

<script>
import {CURRENT_USER_QUERY} from '@/api'
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
        query: CURRENT_USER_QUERY,
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