import request from '@/utils/request'
// 每个方法只负责请求一个url地址
// export导出接口方法，在逻辑页面使用
export const registerAPI = () => {
  // 这里先用这个接口测试下, 如果url以http开头会忽略baseURL, axios直接请求此地址
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username: 'caort',
      password: '123456',
      repassword: '123456'
    }

  })
}
