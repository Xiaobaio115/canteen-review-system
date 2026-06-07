import axios from 'axios'
import { message } from 'antd'
import { getToken, removeToken } from '../utils/token'

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 15000
})

request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { response } = error

    if (response?.status === 401) {
      removeToken()
      message.error('登录已过期，请重新登录')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
      return Promise.reject(new Error('登录已过期'))
    }

    if (response?.status === 403) {
      message.error('没有权限访问')
      return Promise.reject(new Error('没有权限'))
    }

    if (response?.status === 404) {
      message.error('请求的资源不存在')
      return Promise.reject(new Error('资源不存在'))
    }

    if (response?.status >= 500) {
      message.error('服务器错误，请稍后重试')
      return Promise.reject(new Error('服务器错误'))
    }

    const errorMsg = response?.data?.message || error.message || '请求失败'
    message.error(errorMsg)
    return Promise.reject(new Error(errorMsg))
  }
)

export default request
