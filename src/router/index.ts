import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue"
import NotFoundView from "@/views/NotFoundView.vue"
import PassageView from "@/views/PassageView.vue"
import DiscreteMathsView from "@/views/maths/DiscreteMathsView.vue"
import ProbAndStatView from "@/views/maths/ProbAndStatView.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: "/:pathMatch(.*)*", component: NotFoundView},
    {path: "/", component: HomeView},
    {path: "/discrete-maths", component: DiscreteMathsView},
    {path: "/:categoryName/:passageName", component: PassageView},
    {path: "/probability-and-statistics", component: ProbAndStatView},
  ]
})

export default router
