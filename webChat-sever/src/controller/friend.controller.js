const FriendService = require('../service/friend.service')

class FriendController {
  // 获取好友列表
  friendList = async (ctx, next) => {
    const { userId } = ctx.request.body

    const result = await FriendService.selectFriend(userId)

    ctx.body = {
      code: 200,
      msg: '获取好友列表成功',
      data: result
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
    const { userId, friendId } = ctx.request.body

    const result = await FriendService.getChatMessage(userId, friendId)

    // 处理时间格式
    result.forEach(item => {
      item.sendTime = item.sendTime.toLocaleString()
    })

    ctx.body = {
      code: 200,
      msg: '获取聊天消息成功',
      data: result
    }
  }
}

module.exports = new FriendController()
