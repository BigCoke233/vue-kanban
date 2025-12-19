<script setup>
import { Tag, Clock, BellElectric } from 'lucide-vue-next'
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      id: '1000',
      title: 'Dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      status: '',
      priority: '',
      due: '2025-12-31',
      created: '2025-12-12',
      tags: ['inbox', 'task']
    })
  }
})

function startDrag(e, item) {
  e.dataTransfer.dropEffect = 'move'
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('itemID', item.id)
  console.log('Drag started')
}

function onDrop(e, list) {
  const itemID = e.dataTransfer.getData('itemID')
  const item = this.items.find((item) => item.id == itemID)
  item.list = list
}
</script>

<template>
  <div draggable
  @dragstart="startDrag($event, props.data)"
  @drop="onDrop($event, props.data.list)"
  class=" bg-white shadow-md font-sans cursor-pointer select-none">

    <header class="flex gap-4 b-b-1 b-b-solid b-b-neutral-2">
      <div class="bg-emerald py-2 px-4 text-white font-extrabold font-mono">#{{ props.data.id }}</div>
      <div class="flex gap-3 py-2">
        <div v-for="tag in props.data.tags" :key="tag"
         class="text-sm text-neutral-6 inline-flex items-center gap-1">
          <Tag size="12" /> {{ tag }}
        </div>
      </div>
    </header>

    <section class="py-2 px-4">
      <h2 class="m-0 font-extrabold text-3xl">{{ props.data.title }}</h2>
    </section>

    <footer class="flex text-neutral-6 p-4 pt-0">
      <div><Clock size="12" /> <time>{{ props.data.created }}</time></div>
      <el-divider direction="vertical" />
      <div><BellElectric size="12" /> {{ props.data.due }}</div>
    </footer>
  </div>
</template>
