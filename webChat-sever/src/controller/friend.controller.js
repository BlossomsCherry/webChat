const FriendService = require('../service/friend.service')
const userService = require('../service/user.service')
const UserService = require('../service/user.service')

class FriendController {
  // 获取好友列表
  friendList = async (ctx, next) => {
    const { userId } = ctx.request.body

    const state = 0
    const result = await FriendService.selectFriend(userId, state)

    const arr = []
    const newRes = Array.from(new Set(result.map(item => item.friendId)))
    newRes.forEach(item => {
      const index = result.findIndex(element => element.friendId === item)
      arr.push(result[index])
    })

    ctx.body = {
      code: 200,
      msg: '获取好友列表成功',
      data: arr
    }
  }

  // 添加聊天消息
  addMessage = async (ctx, next) => {
    const { userId, friendId, message, type, state } = ctx.request.body

    const result = await FriendService.addMessage(
      userId,
      friendId,
      message,
      type,
      state
    )

    ctx.body = {
      code: 200,
      msg: '添加聊天消息成功',
      data: result
    }
  }

  // 获取聊天消息
  getChatMessage = async (ctx, next) => {
    // const { userId, friendId } = ctx.request.body
    const friendList = ctx.request.body

    const result = await FriendService.getChatMessage(friendList)

    // 处理时间格式
    result.forEach(item => {
      item.forEach(element => {
        element.sendTime = element.sendTime.toLocaleString()
      })
    })

    ctx.body = {
      code: 200,
      msg: '获取聊天消息成功',
      data: result
    }
  }

  // 好友申请查询
  friendApplyList = async (ctx, next) => {
    const { userId } = ctx.request.body

    const state = 3
    const result = await FriendService.selectFriend(userId, state)

    // 处理时间格式
    result.forEach(item => {
      item.createTime = item.createTime.toLocaleString()
    })

    console.log(result)
    ctx.body = {
      code: 200,
      msg: '好友申请查询成功',
      data: result
    }
  }

  // 更新好友状态
  updateFriendState = async (ctx, next) => {
    let { friendId, userId, state } = ctx.request.body

    await userService.updateFriendState(friendId, userId, state)

    const userIdNEw = friendId
    const friendIdNew = userId
    await UserService.updateFriendState(friendIdNew, userIdNEw, state)

    ctx.body = {
      code: 200,
      msg: '更新好友状态成功'
    }
  }
}

module.exports = new FriendController()
