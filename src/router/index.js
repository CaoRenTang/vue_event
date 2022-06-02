import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 路由重定向显示默认页面
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
  },
  {
    path: '/login',
    component: () => import('@/views/login')

  },
  {
    path: '/layout',
    component: () => import('@/views/layout')
  }
]

const router = new VueRouter({
  routes
})

export default router
