import request from '@/utils/request'
/*
* 注册接口
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
