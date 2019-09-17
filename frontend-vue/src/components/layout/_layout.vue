<template functional>
  <div class="container">
    <slot name="header">
      {{ slots.header }}
    </slot>
    <slot name="body">
      {{ slots.body }}
    </slot>
    <slot name="footer">
      {{ slots.footer }}
    </slot>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>

