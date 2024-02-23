import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => ({
    clickStatus: 0 // 判断用户是否点击按钮登录
  }),
  actions: {}
})
