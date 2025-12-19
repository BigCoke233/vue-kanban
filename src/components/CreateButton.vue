<script setup>
import { Plus } from 'lucide-vue-next'
import { ref } from 'vue'
import { useCardStore } from '@/stores/cards'
import { ElMessage } from 'element-plus'

const drawer = ref(false)

const defaultData = {
  title: '',
  description: '',
  due: new Date(),
  tags: [],
  priority: 'low',
  status: 'To Do'
}
const form = ref({
  ...defaultData
})

const cardStore = useCardStore()
const { create } = cardStore

function createCard() {
  if (!form.value.title) {
    ElMessage.error('标题不能为空')
    return
  }

  create(form.value)
  drawer.value = false
  form.value = { ...defaultData }
}
</script>

<template>
  <div class="fixed bottom-0 right-0 p-6">
    <button class="rd-full shadow-lg bg-green-5 b-none outline-none text-white w-16 h-16 cursor-pointer
      animate-zoom-in animate-duration-100 transition hover:scale-95 active:scale-90"
      @click="drawer = true">
      <Plus size="24" />
    </button>
  </div>

  <el-drawer v-model="drawer" title="创建卡片" class="font-sans">
    <el-form :model="form" label-width="auto" size="large"
      class="flex flex-col justify-between h-full">
      <section>
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker v-model="form.due" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input-tag v-model="form.tags" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-radio-group v-model="form.priority" fill="rgb(52, 211, 153)">
            <el-radio-button label="低" value="low" fill="#409EFF" />
            <el-radio-button label="中" value="medium" fill="#67C23A" />
            <el-radio-button label="高" value="high" fill="#F56C6C" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status" fill="rgb(52, 211, 153)">
            <el-radio-button label="待办" value="To Do" />
            <el-radio-button label="进行中" value="In Progress" />
            <el-radio-button label="已完成" value="Done" />
          </el-radio-group>
        </el-form-item>
      </section>

      <section>
        <el-button type="plain" class="w-full" text-color="white" @click="createCard">创建</el-button>
      </section>
    </el-form>
  </el-drawer>
</template>
