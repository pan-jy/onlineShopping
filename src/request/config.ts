import _axios from 'axios'
import { showNotify, closeToast, showLoadingToast } from 'vant'

const axios = _axios.create({
  baseURL: '/api',
  timeout: 10000
})

const unMessageSet = new Set(['/user/show'])

axios.interceptors.request.use(
  (config) => {
    showLoadingToast({ forbidClick: true, message: '加载中...', duration: 0 })
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    closeToast()
    showNotify({ type: 'danger', message: '请求超时' })
    console.log(error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    closeToast()
    const { data } = response
    if (data.code !== 200) {
      showNotify({ type: 'warning', message: data.msg })
      if (data.code === 401 && window.location.hash !== '#/login') {
        window.location.href = '/#/login'
      }
      return Promise.reject(data.msg)
    }

    if (
      !unMessageSet.has(response.config.url ?? '') &&
      response.config.method !== 'get' &&
      data.msg !== 'success'
    ) {
      if (data.msg === 'success')
        showNotify({ type: 'success', message: data.msg })
    }
    return response.data
  },
  (error) => {
    closeToast()
    showNotify({ type: 'danger', message: '请求错误' })
    console.log(error)
    return Promise.reject(error)
  }
)

export default axios
