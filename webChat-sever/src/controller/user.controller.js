const fileService = require('../service/file.service')
const UserService = require('../service/user.service')
const fs = require('fs')
const { AVATAR_PATH } = require('../config/path')

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

  // 查询所有人
  async searchAllPerson(ctx, next) {
    const result = await UserService.searchAllPerson()

    ctx.body = {
      code: 200,
      msg: '查询成功',
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
    const { userId, friendId } = ctx.request.body

    // 通过name查找对应id
    // const [user] = await UserService.findUserByName(userName)
    // const [friend] = await UserService.findUserByName(friendName)

    // 判断目标用户好友状态
    const isFriend = await UserService.isFriend(userId, friendId)

    if (isFriend.length) {
      switch (isFriend[isFriend.length - 1].state) {
        case '0':
          ctx.body = {
            code: 200,
            msg: '和对方已经是好友'
          }
          break
        case '1':
          ctx.body = {
            code: 200,
            msg: '正在申请对方为好友'
          }
          break
        case '3':
          ctx.body = {
            code: 200,
            msg: '对方申请添加为好友'
          }
      }

      if (['0', '1', '3'].includes(isFriend[isFriend.length - 1].state)) return
    }

    // 添加好友
    let state = 1
    await UserService.addFriend(userId, friendId, state)

    // 添加好友后更新好友关系（初始为1，表示正在申请中）
    // const result = await UserService.updateFriendState(friendId, userId, '1')

    ctx.body = {
      code: 200,
      msg: '好友申请已发送',
      data: null
    }

    await next()
  }

  // 同意好友申请（更改状态）
  async updateFriendState(ctx, next) {
    const { friendId, userId, state } = ctx.request.body

    // 1. 更改好友状态
    const result = await UserService.updateFriendState(friendId, userId, state)

    // 2. 以当前用户为id为userId添加数据到user_friend表
    const { friendId: userIdNEw, userId: friendIdNew } = ctx.request.body
    await UserService.addFriend(userIdNEw, friendIdNew, state)

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

  // 显示头像
  async showAvatarImage(ctx, next) {
    // 1.获取用户id
    const { userId } = ctx.params

    // 2.获取用户头像信息
    const avatarInfo = await fileService.queryInfo(userId)

    // 3.读取头像所在文件
    const { filename, mimetype } = avatarInfo

    ctx.type = mimetype
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${filename}`)
  }
}

module.exports = new UserController()
