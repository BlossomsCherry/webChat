import WRequest from '../request'

/**
 * 上传头像
 * @param data
 * @returns
 */
export function uploadAvatar(data: any) {
  return WRequest.post({
    url: '/file/avatar',
    method: 'post',
    data
  })
}
