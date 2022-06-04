import request from '@/utils/request'

/** 注册接口
 * @returns Promise对象
 */
// 对象解构赋值传递参数
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'POST',
    // ES6解构赋值时key和value一样，简写
    data: {
      username,
      password,
      repassword
    }
  })
}
/** 登录接口
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}
/** 获取用户信息
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
  })
}
/** 获取侧边栏数据
 * @returns Promise对象
 */
export const getMenusAPI = () => {
  return request({
    url: '/my/menus'
  })
}
