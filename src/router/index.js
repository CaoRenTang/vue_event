import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', // 默认路径
    component: () => import('@/views/layout'),
    redirect: '/home', // 路由重定向
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      }
    ]
    // 默认打开直接看到布局页
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
    // webpack提供import函数来路由懒加载导入组件
    // 路由懒加载, 就是页面路由路径切换到/reg, 才去加载对应组件代码
    // 好处: 让首页加载文件体积更新, 打开更快
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})

const whiteList = ['/login', '/reg'] // 白名单(无需登录可以访问的路由地址)

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    // 登录了
    if (!store.state.userInfo.username) {
      // 你现在本地有token值, 才去请求用户信息
      store.dispatch('getUserInfoActions')
    }
    next()
  } else {
    // 未登录
    // 数组.includes(值), 作用: 判断值是否在数组里出现过, 出现过原地返回true
    if (whiteList.includes(to.path)) {
      // 未登录, 可以访问的路由地址, 则放行(路由全局前置守卫不会再次触发了, 而是匹配路由表, 让组件挂载)
      next()
    } else {
      // next()强制切换到登录路径上
      next('/login')
    }
  }
})

export default router

// 退出登录, 重新登录, 只走相关组件代码 (异步dom切换, 不会导致所有代码重新执行, App.vue不走)
// 效果不对: 你换个账号它得重新请求用户数据呀
// 解决:
// 1. 可以在登录页面, 登录成功后, 再发请求去拿到用户信息
// 2. 可以在全局前置路由守卫中, 写 (路由跳转的时候, 判断+获取)
