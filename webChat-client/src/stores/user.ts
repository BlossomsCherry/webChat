import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    friendInfo: [],
    friendId: '',
    allFriendList: [],
    currentIndex: localStorage.getItem('currentIndex') || 0
  }),
  actions: {}
})
