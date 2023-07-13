import { UserInfo } from '@/types/user'
import axios from '../config'

async function register(
  username: string,
  phoneNumber: string,
  password: string
) {
  const avatar = `https://api.dicebear.com/6.x/shapes/svg?seed=${username}`
  const res = await axios.post('/user/register', {
    username,
    phoneNumber,
    password,
    avatar
  })
  return res.data
}

async function login(username: string, password: string) {
  const res = await axios.post('/user/login', {
    username,
    password
  })
  return res.data
}

async function logout() {
  localStorage.removeItem('token')
  window.location.reload()
  await axios.post('/user/logout')
}

async function getUserInfo(): Promise<UserInfo> {
  const res = await axios.post('/user/show')
  return res.data
}

export { login, register, getUserInfo, logout }
