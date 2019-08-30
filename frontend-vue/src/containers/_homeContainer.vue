
<template>
  <div>
    <slot :data="{ currentUser, staticData }" />
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
      staticData: 'test'
    }
  },
  apollo: {
    currentUser() {
      return {
        query: currentUserQuery,
        variables: {
          // varName: this.varNames
        },
      }
    }
  }
}
</script>