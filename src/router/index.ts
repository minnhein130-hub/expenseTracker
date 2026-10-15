import { createRouter, createWebHistory } from 'vue-router'

import TransactionView from '../views/TransactionView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'transaction',
      component: TransactionView,
    },
  ],
})

export default router
