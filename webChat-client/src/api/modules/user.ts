import WRequest from '../request'

/**
 * 查询所有用户
 * @returns
 */
export function searchAllPerson() {
  return WRequest.post({
    url: '/user/searchAllPerson'
  })
}

/**
 * 添加好友
 * @param data
 * @returns
 */
export function addFriend(data: addFriend) {
  return WRequest.post({
    url: '/user/addFriend',
    data
  })
}

/**
 * 获取用户头像
 * @param userId
 * @returns
 */
export function getUserAvatar(userId: number) {
  return WRequest.get({
    url: `/user/getAvatar/${userId}`
  })
}
