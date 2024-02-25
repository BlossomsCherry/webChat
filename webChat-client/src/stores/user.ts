import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    friendInfo: [],
    friendId: 0,
    friendList: [],
    currentIndex: Number(localStorage.getItem('currentIndex')) || 0
  }),
  actions: {}
})
