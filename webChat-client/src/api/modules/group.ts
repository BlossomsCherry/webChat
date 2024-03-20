import WRequest from '../request'

/**
 * 建群
 * @param data
 * @returns
 */
export function createGroup(data: any) {
  return WRequest.post({
    url: '/group/createGroup',
    data
  })
}
/**
 * 加群
 * @param data
 * @returns
 */
export function joinGroup(data: any) {
  return WRequest.post({
    url: '/group/joinGroup',
    data
  })
}

/**
 * 查找群
 * @param data
 * @returns
 */
export function searchGroup(id: number) {
  return WRequest.post({
    url: '/group/searchGroup',
    data: {
      userId: id
    }
  })
}

/**
 * 查找群成员
 * @param data
 * @returns
 */
export function searchGroupMember(id: number) {
  return WRequest.post({
    url: '/group/searchGroupMember',
    data: {
      groupId: id
    }
  })
}
