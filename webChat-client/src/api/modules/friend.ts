import WRequest from '../request'

/**
 * 获取好友列表信息
 * @param {*} userId
 * @returns
 */
export function getFriendList(userId: string | null) {
  return WRequest.post({
    url: '/friend/list',
    data: {
      userId
    }
  })
}

/**
 * 添加消息
 * @param data
 * @returns
 */
export function addMessage(data: addMessage) {
  return WRequest.post({
    url: '/friend/addMessage',
    data
  })
}

/**
 * 获取聊天消息
 * @param data
 * @returns
 */
export function getChatMessage(data: getMessage) {
  return WRequest.post({
    url: '/friend/getChatMessage',
    data
  })
}
