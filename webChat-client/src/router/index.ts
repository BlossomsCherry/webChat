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
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/chat',
        name: 'chat',
        component: () => import('@/views/chatAside/chatList.vue')
      },
      {
        path: '/friend',
        name: 'friend',
        component: () => import('@/views/chatAside/chatFriend.vue')
      },
      {
        path: '/chatRoom',
        name: 'chatRoom',
        component: () => import('@/views/chatAside/chatRoom.vue')
      }
    ]
  }
]

// RouterOptions是路由选项类型
const options: RouterOptions = {
  history: createWebHashHistory(),
  routes
}

// Router是路由对象类型
const router: Router = createRouter(options)

router.beforeEach((to, from, next) => {
  const isAuthenticated = checkLogin() // 自定义函数，检查用户是否已登录

  // 如果访问的是登录界面则直接放行
  if (to.path === '/login') {
    if (from.path !== '/') {
      ElNotification({
        message: '您已退出登录!',
        type: 'success',
        duration: 2500
      })

      removeToken()
    }

    next()
    return
  }

  //如果用户未登录且目标路径不是登录界面
  if (!isAuthenticated) {
    next({ name: 'login' })
    ElNotification({
      message: '用户未登录，请先登录!',
      type: 'error',
      duration: 2500
    })
    return
  }

  next()
})

router.afterEach(() => {
  // 跳转之后滚动条回到顶部
  window.scrollTo(0, 0)
})

export default router
