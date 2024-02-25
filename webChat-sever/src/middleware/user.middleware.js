const UserService = require('../service/user.service')
const md5password = require('../utils/md5-password')

/* 验证用户中间件 */
const verifyUser = async (ctx, next) => {
  // 验证客户端传过来的uer是否可以保存到数据库中
  // 1.判断用户名和密码是否为空
  const { userName, password } = ctx.request.body
  if (!userName || !password) {
    return ctx.app.emit('error', 'name_or_password_is_required', ctx)
  }

  // 2.判断name是否在数据库中是否存在
  const users = await UserService.findUserByName(userName)
  if (users.length) {
    // return ctx.app.emit('error', 'name_is_already_exists', ctx)
    return (ctx.body = {
      msg: '用户名已经存在，不能创建~'
    })
  }
  // 3.执行下一个中间件
  await next()
}

/* 加密中间件 */
const handlePassword = async (ctx, next) => {
  // 1.取出密码
  const { password } = ctx.request.body

  // 2.对密码进行加密
  ctx.request.body.password = md5password(password)

  await next()
}

module.exports = { verifyUser, handlePassword }
