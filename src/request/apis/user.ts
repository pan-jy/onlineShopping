import { ViewRecord } from '@/types/commodity'
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
  window.location.hash = '#/home'
  await axios.post('/user/logout')
}

async function getUserInfo(): Promise<UserInfo> {
  const res = await axios.post('/user/show')
  return res.data
}

function addAddress(address: string) {
  return axios.post(`/user/address/addAddress/${address}`)
}

function deleteAddress(addressId: string) {
  return axios.post(`/user/address/deleteAddress/${addressId}`)
}

async function getAddressList() {
  const res = await axios.post('/user/address/getAddressList')
  return res.data
}

function addShoppingCart(commodityId: string, count: number) {
  return axios.post('/user/shoppingTrolley/addUserShoppingTrolley', {
    commodityId,
    count
  })
}

function updateShoppingCartCount(commodityId: string, count: number) {
  return axios.post(
    `/user/shoppingTrolley/updateUserShoppingTrolley/${commodityId}/${count}`
  )
}

function deleteShoppingCart(commodityId: string) {
  return axios.post(
    `/user/shoppingTrolley/deleteUserShoppingTrolley/${commodityId}`
  )
}

async function getUserViewRecord(): Promise<ViewRecord[]> {
  const res = await axios.post('/user/viewingRecord/getUserViewRecord')
  return res.data
}

export {
  login,
  register,
  getUserInfo,
  addAddress,
  deleteAddress,
  getAddressList,
  logout,
  getUserViewRecord,
  addShoppingCart,
  updateShoppingCartCount,
  deleteShoppingCart
}
