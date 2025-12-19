<script setup>
import KanbanCard from '@/components/KanbanCard.vue';
import { useCardStore } from '@/stores/cards';
import { useRoute } from 'vue-router';

const route = useRoute();
const cardID = route.params.id;

const cardStore = useCardStore();
const { getCardById } = cardStore;
const data = getCardById(cardID);
</script>

<template>
  <main class="my-20 w-3xl mx-auto">
    <KanbanCard :data="data" />
    <router-link to="/" class="-z-1 fixed inset-0 w-full h-full"></router-link>
  </main>
</template>
