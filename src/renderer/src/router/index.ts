import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import BaseLayout from '../layout/base.vue'

const LocalRoutes: RouteRecordRaw[] = []

const modules: Record<string, { default: RouteRecordRaw }> = import.meta.glob('./modules/*.ts', {
    eager: true
})
Object.keys(modules).forEach((key) => {
    const module = modules[key]?.default
    if (!module) return
    LocalRoutes.push(...(Array.isArray(module) ? [...module] : [module]))
})

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'root',
        redirect: { name: 'home' },
        component: BaseLayout,
        children: [...LocalRoutes]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {}
})

router.beforeEach(async (_to, _from, next) => {
   next()
})

export default router
