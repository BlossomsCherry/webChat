import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouterOptions, RouteRecordRaw, Router } from 'vue-router'
import checkLogin from '@/utils/checkLogin'
import { removeToken } from '@/utils/saveToken'

import { ElNotification } from 'element-plus'

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
    name: 'layout',
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

// const { loginStatus } = useLoginStore()
router.beforeEach((to, from, next) => {
  const isAuthenticated = checkLogin() // 自定义函数，检查用户是否已登录

  // 如果访问的是登录界面则直接放行
  if (to.path === '/login') {
    next()
    removeToken()
  }

  //如果token数据为null则跳转到指定路径
  if (!isAuthenticated) {
    next({ name: 'login' })

    ElNotification({
      title: '提示',
      message: '无效的会话，或者会话已过期，请重新登录!',
      type: 'error'
    })
  }
  next()
})

export default router
