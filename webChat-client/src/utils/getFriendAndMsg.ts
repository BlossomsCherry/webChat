import { getFriendList, getChatMessage } from '@/api'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { friendId, currentIndex, friendList, allFriendMessage } = storeToRefs(userStore)

/**
 * 获取好友列表及最新消息
 * @param userId
 */
const getFriendAndMsg = (userId: number) => {
  return new Promise((resolve) => {
    getFriendList(Number(userId)).then(async (res: any) => {
      friendList.value = res.data

      friendId.value = res.data[currentIndex.value]?.friendId

      if (res.data.length == 0) return

      // 获取最新消息
      await getChatMessage(friendList.value).then((res: any) => {
        const msg = res.data
        allFriendMessage.value = res.data
        if (msg.length === 0) return

        res.data.forEach((item: any, index: number) => {
          friendList.value[index].newMsg = item[item.length - 1]?.message
          friendList.value[index].minutes = item[item.length - 1]?.sendTime.slice(10, 15)
        })

        resolve(friendList.value)
      })
    })
  })
}

export default getFriendAndMsg
