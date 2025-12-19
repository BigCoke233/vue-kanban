<script setup>
const props = defineProps({
  title: String,
});

const { title } = props;
</script>

<template>
  <el-splitter-panel collapsible class="px-6">
    <header>
      <h2 class="font-mono">{{ title }}</h2>
    </header>
    <div class="flex flex-col gap-4"><slot /></div>
  </el-splitter-panel>
</template>
