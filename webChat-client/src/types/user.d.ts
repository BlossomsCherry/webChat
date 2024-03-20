interface User {
  userName: string
  password: string
  phone?: string
  avatar?: string
  role?: string
  tag?: string
}

interface addFriend {
  userId: number
  friendId: number
}
