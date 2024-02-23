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

    // 判断目标用户好友状态
    const isFriend = await userService.isFriend(user.id, friend.id)

    console.log(isFriend)
    if (isFriend.length) {
      switch (isFriend[isFriend.length - 1].state) {
        case '0':
          ctx.body = {
            code: 200,
            msg: '已经是好友'
          }
          break
        case '1':
          ctx.body = {
            code: 200,
            msg: '正在申请中'
          }
          break
      }

      if (['0', '1'].includes(isFriend[isFriend.length - 1].state)) return
    }

    // 添加好友
    await UserService.addFriend(user.id, friend.id, null)

    // 添加好友后更新好友关系（初始为1，表示申请发送）
    const result = await userService.updateFriendState(friend.id, user.id, '1')

    ctx.body = {
      code: 200,
      msg: '好友申请已发送',
      data: result
    }

    await next()
  }

  // 同意好友申请（更改状态）
  async updateFriendState(ctx, next) {
    const { friendId, userId, state } = ctx.request.body

    // 1. 更改好友状态
    const result = await userService.updateFriendState(friendId, userId, state)

    // 2. 以当前用户为id为userId添加数据到user_friend表
    const { friendId: userIdNEw, userId: friendIdNew } = ctx.request.body
    await userService.addFriend(userIdNEw, friendIdNew, state)

    let msg = ''
    if (state === '2') {
      msg = '已拒绝添加好友'
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
