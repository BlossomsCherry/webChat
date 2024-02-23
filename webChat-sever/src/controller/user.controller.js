const userService = require('../service/user.service')
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

  // 搜索用户
  async search(ctx, next) {
    // 1.获取用户传过来的信息
    const { userName } = ctx.request.body

    const result = await UserService.findUserByName(userName)

    ctx.body = {
      code: 200,
      msg: '搜索成功',
      data: result
    }
  }

  // 添加好友
  async addFriend(ctx, next) {
    // 传入个人name和好友name
    const { userName, friendName } = ctx.request.body

    // 通过name查找对应id
    const [user] = await userService.findUserByName(userName)
    const [friend] = await userService.findUserByName(friendName)

    await UserService.addFriend(user.id, friend.id)

    // 添加好友的同时更新好友关系（初始为1，表示申请发送）
    const result = await userService.updateFriendState(friend.id, user.id, '1')

    ctx.body = {
      code: 200,
      msg: '好友申请已发送',
      data: result
    }

    await next()
  }

  // 同意添加好友
  async updateFriendState(ctx, next) {
    const { friendId, userId, state } = ctx.request.body

    const result = await userService.updateFriendState(friendId, userId, state)

    let msg = ''
    if (state === '2') {
      msg = '对方拒绝添加好友'
    } else {
      msg = '好友添加成功'
    }

    ctx.body = {
      code: 200,
      msg,
      data: result
    }
  }
}

module.exports = new UserController()
