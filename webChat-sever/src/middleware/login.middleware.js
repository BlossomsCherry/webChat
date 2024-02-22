const jwt = require('jsonwebtoken')
const {
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
  const users = await UserService.findUserByName(userName)
  const user = users[0]

  if (!user) {
    return ctx.app.emit('error', NAME_IS_NOT_EXISTS, ctx)
  }

  // 3.查询数据库中的密码和用户传递密码是否一致
  if (user.password !== md5password(password)) {
    return ctx.app.emit('error', PASSWORD_IS_ERROR, ctx)
  }

  // 4.将user对象存储到ctx中
  ctx.user = user

  await next()
}

/* 验证身份 */
const verifyUser = async (ctx, next) => {
  // 1.获取token
  const authorization = ctx.headers.authorization
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
    ctx.app.emit('error', UN_AUTHORIZATION, ctx)
  }
}

module.exports = {
  verifyLogin,
  verifyUser
}
