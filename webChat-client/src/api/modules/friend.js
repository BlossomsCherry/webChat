import WRequest from '../request'

/**
 * 获取好友列表信息
 * @param {*} userId
 * @returns
 */
export function getFriendList(userId) {
  return WRequest.post({
    url: '/friend/list',
    data: {
      userId
    }
  })
}
