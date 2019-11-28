/**
 * @description 封装axios
 */
import axios from 'axios'
// import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，
import { message } from 'antd';
// 创建axios实例
const http = axios.create({
  baseURL: '/api',
  timeout: 30000 // 请求超时时间                                   
})
// 添加request拦截器 
http.interceptors.request.use(config => {
  config.headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  }
  return config
}, error => {
  Promise.reject(error)
})
// 添加respone拦截器
http.interceptors.response.use(
  response => {
    let data = response.data
    if (data.code !== 0) {
      message.error(data.msg)
      return Promise.reject(response)
    }
    return Promise.resolve(data)
  },
  error => {
    let response = error.response
    if (response) {
      switch (response.status) {
        case 401:
          message.error(response.data.msg)
          localStorage.removeItem('userInfo')
          break;
        case 403:
          console.log(403)
          break;
        case 404:
          console.log(404)
          break;
        case 500:
          console.log(500)
          message.error('500 服务器错误')
          break;
        case 504:
          message.error('504 网管错误')
          break;
        default:
          break;
      }
    }
    return Promise.reject(response)
  }
)
export function get(url, params = {}) {
  return http({
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params
  })
}

//封装post请求
export function post(url, data = {}) {
  return http({
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function put(url, data = {}) {
  return http({
    url,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function del(url, data = {}) {
  return http({
    url,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

