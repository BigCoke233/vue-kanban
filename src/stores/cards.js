import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'kanban_cards'

export const useCardStore = defineStore('cards', () => {
  const cards = ref([
    {
      id: 1,
      title: 'Create Kanban Board',
      description: 'Design and implement a Kanban board component',
      status: 'To Do',
      priority: 1,
    },
    {
      id: 2,
      title: 'Implement Drag and Drop',
      description: 'Add drag and drop functionality to the Kanban board',
      status: 'To Do',
      priority: 2,
    },
    {
      id: 3,
      title: 'Design UI',
      description: 'Design the user interface for the Kanban board',
      status: 'In Progress',
      priority: 3,
    },
    {
      id: 4,
      title: 'Implement API',
      description: 'Implement the API for the Kanban board',
      status: 'In Progress',
      priority: 1,
    },
    {
      id: 5,
      title: 'Deploy to Production',
      description: 'Deploy the Kanban board to production',
      status: 'Done',
      priority: 3,
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
    } catch {}
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards.value))
    } catch {}
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
