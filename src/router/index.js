import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { transition: 'fade' }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TaskListView.vue'),
      meta: { transition: 'slide' }
    },
    {
      path: '/tasks/new',
      name: 'new-task',
      component: () => import('../views/NewTaskView.vue'),
      meta: { transition: 'slide' }
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: () => import('../views/TaskDetailView.vue'),
      meta: { transition: 'slide' }
    },
  ],
})

export default router


