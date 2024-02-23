import WRequest from '../request'

/**
 * 获取表情包
 * @returns
 */
export function getEmoji() {
  return WRequest.post({
    url: '/emoji'
  })
}
