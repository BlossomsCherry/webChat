import WRequest from '../request'

/**
 * 获取好友列表信息
 * @param {*} userId
 * @returns
 */
export function getFriendList(userId: number) {
  return WRequest.post({
    url: '/friend/list',
    data: {
      userId
    }
  })
}

/**
 * 查询用户好友申请
 * @param userId
 * @returns
 */
export function friendApplyList(userId: number) {
  return WRequest.post({
    url: '/friend/friendApply',
    data: {
      userId
    }
  })
}

/**
 * 更新好友关系
 * @param data
 * @returns
 */
export function updateFriendState(data: { friendId: number; userId: number; state: string }) {
  return WRequest.post({
    url: '/friend/updateFriendState',
    data
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
export function getChatMessage(data: [getMessage]) {
  return WRequest.post({
    url: '/friend/getChatMessage',
    data
  })
}
