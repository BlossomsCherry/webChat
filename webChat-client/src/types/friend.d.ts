interface addMessage {
  userId: number
  friendId: number
  message?: string
  type?: string
  state?: number
}

interface getMessage {
  userId: number
  friendId: number
}
