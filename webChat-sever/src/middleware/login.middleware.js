const jwt = require('jsonwebtoken')
let {
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_IS_NOT_EXISTS,
  PASSWORD_IS_ERROR,
  UN_AUTHORIZATION
} = require('../config/error')
const UserService = require('../service/user.service')
const md5password = require('../utils/md5-password')
const { PUBLIC_KEY } = require('../config/secret')

/* 用户登录验证 */
const verifyLogin = async (ctx, next) => {
  const { userName, password } = ctx.request.body
  // 1.判断用户名和密码是否为空
  if (!userName || !password) {
    return ctx.app.emit('error', NAME_OR_PASSWORD_IS_REQUIRED, ctx)
  }

  // 2.判断该用户是否在数据库中是否存在
  let users = await UserService.findUserByName(userName)

  const user = users[0]

  if (!user) {
    NAME_IS_NOT_EXISTS = new Error('用户不存在！')
    return ctx.app.emit('error', NAME_IS_NOT_EXISTS, ctx)
  }

  // 3.查询数据库中的密码和用户传递密码是否一致
  if (user.password !== md5password(password)) {
    PASSWORD_IS_ERROR = new Error('密码错误！')
    return ctx.app.emit('error', PASSWORD_IS_ERROR, ctx)
  }

  // 4.修改用户的在线状态
  UserService.updateStatus({ id: user.id, status: 1 })
  users = await UserService.findUserByName(userName)

  // 5.将user对象存储到ctx中
  ctx.user = users[0]

  await next()
}

/* 验证身份 */
const verifyAuth = async (ctx, next) => {
  // 1.获取token
  const authorization = ctx.headers.authorization

  if (!authorization) {
    UN_AUTHORIZATION = new Error('未授权')
    return ctx.app.emit('error', UN_AUTHORIZATION, ctx)
  }
  const token = authorization.replace('Bearer ', '')

  // 2.验证token是否有效
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: 'RS256'
    })

    // 将token的信息保留下来
    ctx.user = result

    ctx.body = '可以访问接口'
    await next()
  } catch (error) {
    UN_AUTHORIZATION = new Error('未授权')
    return ctx.app.emit('error', UN_AUTHORIZATION, ctx)
  }
}

module.exports = {
  verifyLogin,
  verifyAuth
}
