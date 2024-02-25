import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    friendInfo: [],
    friendId: 0,
    allFriendList: [],
    currentIndex: Number(localStorage.getItem('currentIndex')) || 0
  }),
  actions: {}
})
