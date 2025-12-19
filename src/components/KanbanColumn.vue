<script setup>
const props = defineProps({
  title: String,
})
const emit = defineEmits(['drop-card'])

function onDragOver(e) {
  e.preventDefault()
}

function onDrop(e) {
  const json = e.dataTransfer.getData('application/json')
  let id = null
  try {
    id = JSON.parse(json)?.id
  } catch {}
  if (!id) {
    const plain = e.dataTransfer.getData('itemID') || e.dataTransfer.getData('text/plain')
    if (plain) id = Number(plain)
  }
  if (!id) return
  emit('drop-card', { id, toStatus: props.title })
}
</script>

<template>
  <el-splitter-panel collapsible class="px-6" @dragover.prevent="onDragOver" @drop="onDrop">
    <header>
      <h2 class="font-mono">{{ props.title }}</h2>
    </header>
    <div class="flex flex-col gap-4"><slot /></div>
  </el-splitter-panel>
</template>
