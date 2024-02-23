import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      userId: '',
      username: '',
      avatar: '',
      createTime: ''
    },
    friendList: []
  }),
  actions: {}
})