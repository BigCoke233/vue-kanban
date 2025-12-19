<script setup>
import { Tag, Clock, BellElectric } from 'lucide-vue-next'
const emit = defineEmits(['dragstart', 'dragend'])
const props = defineProps({
  data: Object,
  style: Object
})

function startDrag(e) {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('itemID', String(props.data.id))
  e.dataTransfer.setData('text/plain', String(props.data.id))
  e.dataTransfer.setData('application/json', JSON.stringify(props.data))
  emit('dragstart', props.data)
  console.log('Drag started')
}

function onDragEnd() {
  emit('dragend', props.data)
}
</script>

<template>
  <div draggable="true"
    @dragstart="startDrag"
    @dragend="onDragEnd"
    :id="`card-${props.data.id}`"
    class=" bg-white shadow-md font-sans cursor-pointer select-none"
    :style="{ ...props.style, viewTransitionName: `card-${props.data.id}` }">

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
