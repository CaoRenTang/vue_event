// 基于axios封装网络请求方法
import axios from 'axios'
// 创建一个自定的axios方法(比原axios多了个基地址)
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})
// 导出自定义的axios方法, 供外面调用传参发请求
export default myAxios
