<script setup>
import { Tag, Clock, BellElectric, AlertCircle } from 'lucide-vue-next'
import { computed } from 'vue'
const emit = defineEmits(['dragstart', 'dragend'])
const props = defineProps({
  data: Object,
  style: Object,
  editable: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: 'bg-emerald',
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
  const now = new Date()
  const diff = date - now
  const absDiff = Math.abs(diff)
  const oneDay = 1000 * 60 * 60 * 24

  // If within 7 days, use relative time
  if (absDiff < oneDay * 7) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

    const days = Math.round(diff / oneDay)
    if (Math.abs(days) >= 1) return rtf.format(days, 'day')

    const hours = Math.round(diff / (1000 * 60 * 60))
    if (Math.abs(hours) >= 1) return rtf.format(hours, 'hour')

    const minutes = Math.round(diff / (1000 * 60))
    return rtf.format(minutes, 'minute')
  }

  // Otherwise use absolute date
  let result = new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)

  if (date.getFullYear() === new Date().getFullYear()) {
    result = result.substring(5)
  }

  return result
}

const createdDateString = computed(() => {
  if (!props.data.created) return 'today'
  return transformDate(props.data.created)
})

const isUrgent = computed(() => {
  if (!props.data.due) return false
  const due = new Date(props.data.due)
  const now = new Date()
  const diff = due - now
  // Urgent if due within 24 hours (86400000 ms)
  return diff > 0 && diff < 86400000
})

const remainingTime = computed(() => {
  if (!props.data.due) return ''
  const due = new Date(props.data.due)
  const now = new Date()
  const diff = due - now

  if (diff <= 0) return 'Overdue'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 24) {
    return `${hours}h remaining`
  }
  const days = Math.floor(hours / 24)
  return `${days}d remaining`
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
    class="bg-white shadow-md font-sans cursor-pointer select-none relative transition-all duration-300"
    :class="{ 'shadow-red-200 shadow-lg border-2 border-red-500': isUrgent }"
    :style="{ ...props.style, viewTransitionName: `card-${props.data.id}` }"
  >
    <div
      v-if="isUrgent"
      class="absolute -top-3 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 z-10 animate-pulse"
    >
      <Clock size="12" /> {{ remainingTime }}
    </div>

    <header class="flex gap-4 b-b-1 b-b-solid b-b-neutral-2">
      <div :class="`py-2 px-4 text-white font-extrabold font-mono ${props.color}`">
        #{{ props.data.id }}
      </div>
      <div class="flex gap-3 py-2 items-center">
        <div
          v-if="props.data.priority"
          class="text-sm font-bold flex items-center gap-1"
          :class="{
            'text-red-600': props.data.priority >= 3,
            'text-yellow-600': props.data.priority === 2,
            'text-blue-600': props.data.priority <= 1,
          }"
        >
          <AlertCircle size="12" /> P{{ props.data.priority }}
        </div>
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
