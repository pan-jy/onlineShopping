import _axios from 'axios'

const axios = _axios.create({
  baseURL: '/api',
  timeout: 10000
})

axios.interceptors.request.use(
  (config) => {
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
    return data
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default axios
