import _axios from 'axios'
import { showNotify } from 'vant'

const axios = _axios.create({
  baseURL: '/api',
  timeout: 10000
})

const unMessageSet = new Set(['/user/show'])

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
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
    console.log(error)
    return Promise.reject(error)
  }
)

export default axios
