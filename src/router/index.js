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

router.beforeResolve((to, from, next) => {
  if (!document.startViewTransition) {
    next();
    return;
  }
  document.startViewTransition(() => {
    next();
  });
});

export default router
