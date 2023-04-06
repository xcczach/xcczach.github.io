import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue"
import NotFoundView from "@/views/NotFoundView.vue"
import DiscreteMathsView from '@/views/maths/DiscreteMathsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: "/:pathMatch(.*)*", component: NotFoundView},
    {path: "/", component: HomeView},
    {path: "/discrete-maths", component: DiscreteMathsView},
  ]
})

export default router
