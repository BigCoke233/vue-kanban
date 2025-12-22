<script setup>
import { Search } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { useCardStore } from '@/stores/cards'
import { useRouter } from 'vue-router'

const router = useRouter()
const cardStore = useCardStore()
const dialogVisible = ref(false)

const filters = ref({
  query: '',
  priority: null,
  tags: [],
  status: null
})

// Options for filters
const priorityOptions = [
  { label: '全部', value: null },
  { label: '高', value: 3 },
  { label: '中', value: 2 },
  { label: '低', value: 1 }
]

const statusOptions = [
  { label: '全部', value: null },
  { label: 'To Do', value: 'To Do' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Done', value: 'Done' }
]

// Get all unique tags from cards
const allTags = computed(() => {
  const tags = new Set()
  cardStore.cards.forEach(card => {
    if (card.tags) {
      card.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).map(tag => ({ label: tag, value: tag }))
})

const filteredCards = computed(() => {
  return cardStore.cards.filter(card => {
    // Text search
    const query = filters.value.query.toLowerCase()
    const matchesQuery = !query || 
      card.title.toLowerCase().includes(query) || 
      card.description.toLowerCase().includes(query)

    // Priority filter
    const matchesPriority = filters.value.priority === null || 
      card.priority === filters.value.priority

    // Status filter
    const matchesStatus = filters.value.status === null || 
      card.status === filters.value.status

    // Tags filter
    const matchesTags = filters.value.tags.length === 0 || 
      (card.tags && filters.value.tags.every(tag => card.tags.includes(tag)))

    return matchesQuery && matchesPriority && matchesStatus && matchesTags
  })
})

function navigateToCard(id) {
  dialogVisible.value = false
  router.push(`/${id}`)
}
</script>

<template>
  <div class="fixed bottom-24 right-0 p-6 z-50">
    <button class="rd-full shadow-lg bg-blue-500 b-none outline-none text-white w-16 h-16 cursor-pointer
      animate-zoom-in animate-duration-100 transition hover:scale-95 active:scale-90 flex items-center justify-center"
      @click="dialogVisible = true">
      <Search size="24" />
    </button>
  </div>

  <el-dialog
    v-model="dialogVisible"
    title="搜索卡片"
    width="600px"
    class="rounded-lg"
  >
    <div class="flex flex-col gap-4">
      <!-- Search Input -->
      <el-input
        v-model="filters.query"
        placeholder="搜索标题或描述..."
        clearable
        prefix-icon="Search"
        size="large"
      />

      <!-- Filters -->
      <div class="flex flex-wrap gap-4">
        <el-select v-model="filters.priority" placeholder="优先级" clearable class="w-32">
          <el-option
            v-for="item in priorityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select v-model="filters.status" placeholder="状态" clearable class="w-32">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="filters.tags"
          multiple
          collapse-tags
          placeholder="标签"
          class="flex-1"
        >
          <el-option
            v-for="item in allTags"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <!-- Results List -->
      <div class="max-h-96 overflow-y-auto mt-2 space-y-2">
        <div v-if="filteredCards.length === 0" class="text-center text-gray-500 py-8">
          未找到匹配的卡片
        </div>
        <div
          v-for="card in filteredCards"
          :key="card.id"
          class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          @click="navigateToCard(card.id)"
        >
          <div class="flex justify-between items-start">
            <h3 class="font-bold text-gray-800">{{ card.title }}</h3>
            <span class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
              {{ card.status }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ card.description }}</p>
          <div class="flex gap-2 mt-2">
            <span 
              v-for="tag in card.tags" 
              :key="tag"
              class="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
