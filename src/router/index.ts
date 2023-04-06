import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../views/HomeView.vue"
import DiscreteMathsView from '@/views/maths/DiscreteMathsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: "/", component: HomeView},
    {path: "/discrete-maths", component: DiscreteMathsView}
  ]
})

export default router
