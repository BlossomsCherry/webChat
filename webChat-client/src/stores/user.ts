import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: (): {
    userId: number
    friendInfo: any[]
    friendId: number
    friendList: any[]
    addFG: number
    allFriendMessage: any[]
    currentIndex: number
  } => ({
    userId: sessionStorage.getItem('userId') ? Number(sessionStorage.getItem('userId')) : 0,
    friendInfo: [],
    friendId: -1,
    friendList: [],
    addFG: 0,
    allFriendMessage: [],
    currentIndex: Number(sessionStorage.getItem('currentIndex')) || 0
  }),
  actions: {}
})
