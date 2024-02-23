import WRequest from '../request'

/**
 * 登录
 * @param data
 * @returns
 */
export const login = (data: object) => {
  return WRequest.post({
    url: '/login',
    data
  })
}

/**
 * 注册
 * @param {*} data
 * @returns
 */
export const register = (data: object) => {
  return WRequest.post({
    url: 'user/register',
    data
  })
}
