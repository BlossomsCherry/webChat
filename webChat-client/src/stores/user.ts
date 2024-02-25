import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: 0,
    friendInfo: [],
    friendId: -1,
    friendList: [],
    addFG: 0,
    currentIndex: Number(localStorage.getItem('currentIndex')) || 0
  }),
  actions: {}
})
