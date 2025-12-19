import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'kanban_cards'

export const useCardStore = defineStore('cards', () => {
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
    const card = cards.value.find(c => c.id === Number(id))
    if (!card) return
    card.status = status
  }

  load()
  watch(cards, save, { deep: true })

  function getCardsByStatus(status) {
    return cards.value.filter(card => card.status === status);
  }

  return {
    cards,
    getCardsByStatus,
    setCardStatus
  }
})
