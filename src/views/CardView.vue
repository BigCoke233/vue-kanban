<script setup>
import { computed } from 'vue'
import KanbanCard from '@/components/KanbanCard.vue'
import CardAnnotations from '@/components/CardAnnotations.vue'
import { useCardStore } from '@/stores/cards'
import { useRoute, useRouter } from 'vue-router'
import { Trash2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const cardID = Number(route.params.id)

const store = useCardStore()
const card = computed(() => store.getCardById(cardID))

const statusColors = {
  'To Do': 'bg-emerald',
  'In Progress': 'bg-blue',
  Done: 'bg-purple',
}

const cardColor = computed(() => {
  if (!card.value) return 'bg-emerald'
  return statusColors[card.value.status] || 'bg-emerald'
})

function deleteCard() {
  if (confirm('Are you sure you want to delete this card?')) {
    store.remove(cardID)
    router.push('/')
  }
}
</script>

<template>
  <main v-if="card" class="my-20 w-3xl mx-auto relative z-10">
    <section class="relative">
      <button
        @click="deleteCard"
        class="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 rounded-full transition-colors bg-white/80 shadow-lg absolute b-none top-2 -right-10 cursor-pointer"
      >
        <Trash2 :size="16" />
      </button>
      <KanbanCard :data="card" :editable="true" :color="cardColor" :draggable="false" />
    </section>

    <!-- Annotations -->
    <div>
      <CardAnnotations :card-id="cardID" />
    </div>
  </main>

  <!-- Backdrop -->
  <router-link to="/" class="fixed inset-0"></router-link>
</template>
