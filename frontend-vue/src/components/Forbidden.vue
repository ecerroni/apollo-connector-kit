<template>
   <div>
    <h1>You're trying to access a resource that is forbidden</h1>
     <p>Your current role doesn't grant you enough privileges to perform this action</p>
     <a href="/">Home</a>
   </div>
</template>

<script>
// import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'forbidden',
};
</script>

<style scoped>

</style>
