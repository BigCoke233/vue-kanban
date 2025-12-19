<script setup>
import { ref, computed } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue';
import KanbanCard from './components/KanbanCard.vue';
import KanbanColumn from './components/KanbanColumn.vue';

const cards = ref([
  {
    id: 1,
    title: 'Create Kanban Board',
    description: 'Design and implement a Kanban board component',
    status: 'To Do'
  },
  {
    id: 2,
    title: 'Implement Drag and Drop',
    description: 'Add drag and drop functionality to the Kanban board',
    status: 'To Do'
  },
  {
    id: 3,
    title: 'Design UI',
    description: 'Design the user interface for the Kanban board',
    status: 'In Progress'
  },
  {
    id: 4,
    title: 'Implement API',
    description: 'Implement the API for the Kanban board',
    status: 'In Progress'
  },
  {
    id: 5,
    title: 'Deploy to Production',
    description: 'Deploy the Kanban board to production',
    status: 'Done'
  }
]);

const todoCards = computed(() => cards.value.filter(card => card.status === 'To Do'));
const inProgressCards = computed(() => cards.value.filter(card => card.status === 'In Progress'));
const doneCards = computed(() => cards.value.filter(card => card.status === 'Done'));

const columns = computed(() => ([
  {
    id: 1,
    title: 'To Do',
    cards: todoCards.value
  },
  {
    id: 2,
    title: 'In Progress',
    cards: inProgressCards.value
  },
  {
    id: 3,
    title: 'Done',
    cards: doneCards.value
  }
]));

function onDropCard({ id, toStatus }) {
  const card = cards.value.find(c => c.id === Number(id))
  if (!card) return
  card.status = toStatus
}
</script>

<template>
  <main class="w-full mx-auto">
    <KanbanBoard>
      <KanbanColumn v-for="column in columns" :key="column.id" :title="column.title" @drop-card="onDropCard">
        <KanbanCard v-for="card in column.cards" :key="card.id" :data="card" />
      </KanbanColumn>
    </KanbanBoard>
  </main>
</template>

<style scoped></style>
