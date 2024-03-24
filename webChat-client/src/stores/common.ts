import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', {
  state: (): {
    tabsIndex: number
    friendList: any
    friend_applyList: any
    socketId: string
    groupId: number
    showInfo: boolean
    showCreateGroup: boolean
    currentIndex: number
    groupUserAvatar: any[]
    refresh: boolean
  } => ({
    tabsIndex: 0, //左侧导航栏切换
    friendList: [], //好友列表
    friend_applyList: [], //好友申请列表
    socketId: '',
    groupId: 0,
    showInfo: false,
    showCreateGroup: false,
    currentIndex: Number(sessionStorage.getItem('currentIndex')) || 0,
    groupUserAvatar: [],
    refresh: false
  }),
  actions: {}
})
