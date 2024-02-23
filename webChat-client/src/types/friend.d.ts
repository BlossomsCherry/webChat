interface addMessage {
  userId: number
  friendId: number
  message?: string
  type?: number
  state?: number
}

interface getMessage {
  userId: number
  friendId: number
}
