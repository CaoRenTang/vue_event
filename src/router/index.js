import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

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
// 全局路由导航守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token && !store.state.userInfo.username) {
    store.dispatch('getUserInfoActions')
  }
  next()
})
export default router
