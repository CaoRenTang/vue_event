// 基于axios封装, 网络请求的函数
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

// axios.create()创建一个带配置项的自定义axios函数
// myAxios请求的时候, 地址baseURL+url, 然后去请求后台
// 导出基地址变量
export const baseURL = 'http://big-event-vue-api-t.itheima.net'
const myAxios = axios.create({
  baseURL: baseURL
})

// 定义请求拦截器
// api里每次调用request都会先走这个请求拦截器
myAxios.interceptors.request.use(function (config) {
  // config配置对象(要请求后台的参数都在这个对象上)
  // 在请求前会触发一次, 这个return交给axios源码内, 根据配置项发起请求

  // 在发起时, 统一携带请求头Authorization和token值
  // 判断, 登录页面和注册页面, vuex里无token, 而且登录接口和注册接口也不需要携带token(其他页面需要)
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }

  return config
}, function (error) {
  return Promise.reject(error)
})
// 定义响应拦截器
myAxios.interceptors.response.use(function (response) {
  // 响应http状态码为 2xx或3xx 时触发成功的回调，形参中的 response 是“成功的结果”
  return response
}, function (error) {
  // 响应状态码为4xx, 5xx 时触发失败的回调，形参中的 error 是“失败的结果”
  // return到axios原地Promise对象位置, 作为失败拒绝的状态(如果那边用try+catch或者catch函数捕获, 可以捕获到我们传递过去的这个error变量的值)

  if (error.response.status === 401) {
    // 本次响应是token过期了
    // 清除vuex里一切, 然后切换回到登录页面 (被动退出登录状态)
    store.commit('updateToken', '')
    store.commit('updateUserInfo', {})
    // 自动返回登录页
    router.push('/login')

    Message.error('用户身份已过期!')
  }
  return Promise.reject(error)
})

// 导出axios自定义函数
export default myAxios
