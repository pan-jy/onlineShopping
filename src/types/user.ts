type UserInfo = {
  accountBalance: number
  avatar: string
  createTime: string
  id: number
  password: string
  phoneNumber: string
  username: string
}

type Address = {
  id: number
  userId: string
  userName: string
  address: string
  phoneNumber: string
}

export type { UserInfo, Address }
