<script setup>
import { ref, computed } from 'vue'
import { Send, Trash2 } from 'lucide-vue-next'
import { useCardStore } from '@/stores/cards'

const props = defineProps({
  cardId: {
    type: [Number, String],
    required: true,
  },
})

const store = useCardStore()
const newComment = ref('')

const card = computed(() => store.getCardById(props.cardId))
const comments = computed(() => {
  return (card.value?.comments || []).sort((a, b) => new Date(b.created) - new Date(a.created))
})

function submitComment() {
  if (!newComment.value.trim()) return
  const { addComment } = store
  addComment(props.cardId, newComment.value)
  newComment.value = ''
}

function deleteComment(commentId) {
  if (confirm('Delete this annotation?')) {
    const { removeComment } = store
    removeComment(props.cardId, commentId)
  }
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(dateStr))
}
</script>

<template>
  <div class="mt-8">
    <!-- Comment Input -->
    <div class="flex gap-2 mb-8 items-center">
      <input
        v-model="newComment"
        @keydown.enter="submitComment"
        placeholder="添加批注..."
        class="flex-1 p-2 b-none b-b-2 b-b-neutral-2 b-b-solid focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
      />
      <button
        @click="submitComment"
        :disabled="!newComment.trim()"
        class="w-8 h-8 inline-flex items-center justify-center b-none outline-none bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <Send :size="16" />
      </button>
    </div>

    <!-- Timeline -->
    <div class="relative pl-4 border-l-2 border-neutral-100 space-y-6">
      <div v-for="comment in comments" :key="comment.id" class="relative pl-6 group">
        <!-- Timeline dot -->
        <div
          class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white ring-1 ring-neutral-100"
        ></div>

        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="text-xs text-neutral-400 font-mono">{{
              formatDate(comment.created)
            }}</span>
            <button
              @click="deleteComment(comment.id)"
              class="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-opacity"
            >
              <Trash2 :size="12" />
            </button>
          </div>
          <div class="text-neutral-700 text-sm whitespace-pre-wrap">{{ comment.content }}</div>
        </div>
      </div>

      <div v-if="comments.length === 0" class="text-neutral-400 text-sm italic pl-6">暂无批注</div>
    </div>
  </div>
</template>
