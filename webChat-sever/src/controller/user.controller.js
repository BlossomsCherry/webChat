const UserService = require('../service/user.service')

class UserController {
  async create(ctx, next) {
    // 1.获取用户传过来的信息
    const user = ctx.request.body

    // 3.将信息存储到数据库
    const result = await UserService.create(user)

    // 4.查看存储结果，告知前端创建成功
    ctx.body = {
      code: 200,
      msg: '用户创建成功~',
      data: result
    }
  }
}

module.exports = new UserController()
