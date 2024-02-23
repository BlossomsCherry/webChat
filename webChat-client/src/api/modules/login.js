import WRequest from '../request'

/**
 * 登录
 * @param data
 * @returns
 */

export const login = (data) => {
  return WRequest.post({
    url: '/login',
    data
  })
}

export const register = (data) => {
  return WRequest.post({
    url: 'user/register',
    data
  })
}
