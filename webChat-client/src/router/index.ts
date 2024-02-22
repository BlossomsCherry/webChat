import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouterOptions, RouteRecordRaw, Router } from 'vue-router'

//RouterRecordRaw是路由组件对象
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/layout',
    component: () => import('@/views/layout.vue')
  }
]

// RouterOptions是路由选项类型
const options: RouterOptions = {
  history: createWebHashHistory(),
  routes
}

// Router是路由对象类型
const router: Router = createRouter(options)

export default router
