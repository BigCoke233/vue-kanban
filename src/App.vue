<script setup>
import KanbanBoard from './components/KanbanBoard.vue';
import KanbanCard from './components/KanbanCard.vue';
import KanbanColumn from './components/KanbanColumn.vue';

</script>

<template>
  <main class="w-full mx-auto">
    <KanbanBoard>
      <KanbanColumn title="To Do">
        <KanbanCard title="Create Kanban Board" />
        <KanbanCard title="Implement Drag and Drop" />
      </KanbanColumn>
      <KanbanColumn title="In Progress">
        <KanbanCard title="Design UI" />
        <KanbanCard title="Implement API" />
      </KanbanColumn>
      <KanbanColumn title="Done">
        <KanbanCard title="Deploy to Production" />
      </KanbanColumn>
    </KanbanBoard>
  </main>
</template>

<style scoped></style>
