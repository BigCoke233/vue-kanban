import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'kanban_cards'

export const useCardStore = defineStore('cards', () => {
  const cards = ref([
    {
      id: 1,
      title: '👋 欢迎使用看板',
      description: '这是一个基于 Vue 3 的看板应用。你可以尝试拖拽这张卡片到其他列。',
      status: 'To Do',
      priority: 3,
      created: new Date().toISOString(),
      tags: ['入门', '帮助'],
    },
    {
      id: 2,
      title: '尝试编辑卡片',
      description: '点击卡片标题即可进入详情页，你可以修改标题、描述、截止日期，或者添加批注。',
      status: 'To Do',
      priority: 2,
      created: new Date().toISOString(),
      tags: ['功能', '编辑'],
    },
    {
      id: 3,
      title: '高优先级任务',
      description:
        '这张卡片设置了高优先级 (P3)。\n你会发现它在列表中自动排在最前面，并且带有醒目的红色标记。',
      status: 'In Progress',
      priority: 3,
      created: new Date().toISOString(),
      tags: ['优先级', '排序'],
    },
    {
      id: 4,
      title: '截止日期提醒',
      description:
        '快要到期的卡片会变红并显示剩余时间。\n\n尝试给这张卡片设置一个明天的截止日期看看效果！',
      status: 'In Progress',
      priority: 2,
      created: new Date().toISOString(),
      tags: ['时间', '提醒'],
    },
    {
      id: 5,
      title: '完成的项目',
      description: '将卡片拖到 "Done" 列，完成了就去喝杯咖啡吧！☕️',
      status: 'Done',
      priority: 1,
      created: new Date().toISOString(),
      tags: ['完成', '庆祝'],
    },
    {
      id: 6,
      title: '给卡片添加批注',
      description:
        '点击卡片进入详情页面，会发现卡片下方有一个输入框，在输入框中添加内容并点击按钮，就能添加批注！\n\n如果任务有了新进展，或者有相关的笔记，就可以写在批注里。',
      status: 'To Do',
      priority: 1,
      created: new Date().toISOString(),
      tags: ['功能', '批注'],
    },
    {
      id: 7,
      title: '删除卡片',
      description: '点击卡片进入详情页面，点击卡片右边的垃圾桶图标，就可以删除不想要的卡片。',
      status: 'To Do',
      priority: 1,
      created: new Date().toISOString(),
      tags: ['功能', '删除'],
    },
  ])

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        cards.value = parsed
      }
    } catch (e) {
      console.error('加载看板卡片失败:', e)
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards.value))
    } catch (e) {
      console.error('保存看板卡片失败:', e)
    }
  }

  function setCardStatus(id, status) {
    const card = cards.value.find((c) => c.id === Number(id))
    if (!card) return
    card.status = status
  }

  load()
  watch(cards, save, { deep: true })

  function getCardsByStatus(status) {
    return cards.value
      .filter((card) => card.status === status)
      .sort((a, b) => {
        const priorityDiff = (b.priority || 0) - (a.priority || 0)
        if (priorityDiff !== 0) return priorityDiff

        const aDue = a.due ? new Date(a.due).getTime() : Infinity
        const bDue = b.due ? new Date(b.due).getTime() : Infinity
        return aDue - bDue
      })
  }

  function getCardById(id) {
    return cards.value.find((card) => card.id === Number(id))
  }

  function create(card) {
    const newCard = {
      id: cards.value.length + 1,
      title: card.title || '未命名卡片',
      description: card.description,
      status: card.status || 'To Do',
      tags: card.tags || [],
      priority: card.priority || 1,
      due: card.due,
      created: new Date(),
    }
    cards.value.push(newCard)
  }

  function remove(id) {
    const index = cards.value.findIndex((c) => c.id === Number(id))
    if (index === -1) return
    cards.value.splice(index, 1)
  }

  function addComment(cardId, content) {
    const card = getCardById(cardId)
    if (!card) return
    if (!card.comments) card.comments = []
    card.comments.push({
      id: Date.now(),
      content,
      created: new Date(),
    })
  }

  function removeComment(cardId, commentId) {
    const card = getCardById(cardId)
    if (!card || !card.comments) return
    const index = card.comments.findIndex((c) => c.id === commentId)
    if (index === -1) return
    card.comments.splice(index, 1)
  }

  return {
    cards,
    getCardsByStatus,
    getCardById,
    setCardStatus,
    create,
    remove,
    addComment,
    removeComment,
  }
})
