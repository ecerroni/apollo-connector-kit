<template functional>
  <header
    key="header"
    class="flex justify-start align-baseline"
  >
    <div
      id="header-content"
      class="inline-block w-full"
    >
      <slot>
        <div class="bg-green-500 w-full h-8 flex justify-center items-center">
          <span class="text-gray-100 antialiased">Apollo Connector Kit</span>
        </div>
      </slot>
    </div>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  margin-bottom: 60px;
  /* padding: 10px 0; */
  /* border-bottom: 3px solid #35495e; */
}
</style>
