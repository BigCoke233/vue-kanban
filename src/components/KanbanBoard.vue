<script setup>
import { ref } from 'vue'

function getLayout() {
  return window.innerWidth < 768 ? 'vertical' : 'horizontal'
}

const layout = ref(getLayout())

// on window resize
window.addEventListener('resize', () => {
  layout.value = getLayout()
})
</script>

<template>
  <div
    style="height: 100vh;"
  >
    <el-splitter lazy :layout="layout">
      <slot />
    </el-splitter>
  </div>
</template>

<style scoped>
.demo-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
