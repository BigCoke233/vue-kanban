import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/KanbanView.vue')
    },
    {
      path: '/:id',
      name: 'card',
      component: () => import('../views/CardView.vue')
    }
  ],
})

export default router
