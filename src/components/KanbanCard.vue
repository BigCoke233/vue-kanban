<script setup>
import { Tag, Clock, BellElectric } from 'lucide-vue-next'
import { timeAgo } from 'humantime-js'
import { computed } from 'vue'
const emit = defineEmits(['dragstart', 'dragend'])
const props = defineProps({
  data: Object,
  style: Object,
  editable: {
    type: Boolean,
    default: false,
  },
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

function transformDate(date) {
  if (!date) return ''

  date = new Date(date)
  if (new Date() - date < 1000 * 60 * 60 * 24 * 7) {
    return timeAgo(date)
  } else {
    let result = new Intl.DateTimeFormat('zh-CN', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date)

    if (date.getFullYear() === new Date().getFullYear()) {
      result = result.substring(5)
    }

    return result
  }
}

const createdDateString = computed(() => {
  if (!props.data.created) return ''
  return transformDate(props.data.created)
})

const dueDateString = computed(() => {
  if (!props.data.due) return ''
  return transformDate(props.data.due)
})
</script>

<template>
  <div
    draggable="true"
    @dragstart="startDrag"
    @dragend="onDragEnd"
    :id="`card-${props.data.id}`"
    class="bg-white shadow-md font-sans cursor-pointer select-none"
    :style="{ ...props.style, viewTransitionName: `card-${props.data.id}` }"
  >
    <header class="flex gap-4 b-b-1 b-b-solid b-b-neutral-2">
      <div class="bg-emerald py-2 px-4 text-white font-extrabold font-mono">
        #{{ props.data.id }}
      </div>
      <div class="flex gap-3 py-2">
        <div
          v-for="tag in props.data.tags"
          :key="tag"
          class="text-sm text-neutral-6 inline-flex items-center gap-1"
        >
          <Tag size="12" /> {{ tag }}
        </div>
      </div>
    </header>

    <section class="py-2 px-4">
      <h2 v-if="!props.editable" class="m-0 font-extrabold text-3xl">{{ props.data.title }}</h2>
      <input
        v-else
        v-model="props.data.title"
        class="m-0 font-extrabold text-3xl w-full border-none outline-none bg-transparent placeholder-gray-400"
        placeholder="Card Title"
      />

      <div v-if="props.editable || props.data.description" class="mt-4">
        <p v-if="!props.editable" class="text-gray-600 whitespace-pre-wrap">
          {{ props.data.description }}
        </p>
        <textarea
          v-else
          v-model="props.data.description"
          class="w-full min-h-[100px] text-gray-600 border-none outline-none bg-transparent resize-none placeholder-gray-400 font-sans"
          placeholder="Add a description..."
        ></textarea>
      </div>
    </section>

    <footer class="flex text-neutral-4 text-sm font-mono p-4 pt-0 items-center">
      <div v-if="props.data.created">
        <Clock size="12" /> <time>{{ createdDateString }}</time>
      </div>
      <el-divider direction="vertical" />
      <div v-if="!props.editable && props.data.due">
        <BellElectric size="12" /> {{ dueDateString }}
      </div>
      <div v-else-if="props.editable" class="flex items-center gap-1">
        <BellElectric size="12" />
        <input
          type="date"
          v-model="props.data.due"
          class="border-none outline-none bg-transparent text-sm font-mono text-neutral-4"
        />
      </div>
    </footer>
  </div>
</template>
