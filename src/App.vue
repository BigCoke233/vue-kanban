<script setup>
import { computed } from 'vue'

import { useCardStore } from './stores/cards';

import KanbanBoard from './components/KanbanBoard.vue';
import KanbanCard from './components/KanbanCard.vue';
import KanbanColumn from './components/KanbanColumn.vue';
import CreateButton from './components/CreateButton.vue';

const cardStore = useCardStore();
const { getCardsByStatus, setCardStatus } = cardStore;

const todoCards = computed(() => getCardsByStatus('To Do'));
const inProgressCards = computed(() => getCardsByStatus('In Progress'));
const doneCards = computed(() => getCardsByStatus('Done'));

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
  setCardStatus(id, toStatus)
}
</script>

<template>
  <main class="w-full mx-auto">
    <KanbanBoard>
      <KanbanColumn v-for="column in columns" :key="column.id" :title="column.title" @drop-card="onDropCard">
        <KanbanCard v-for="card in column.cards" :key="card.id" :data="card" />
      </KanbanColumn>
    </KanbanBoard>

    <CreateButton />
  </main>
</template>

<style scoped></style>
