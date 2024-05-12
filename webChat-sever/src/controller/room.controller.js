const roomService = require('../service/room.service')

class GroupController {
  // 加入群组
  async joinRoom(ctx, next) {
    const { userId, roomId, userName, avatar } = ctx.request.body

    const result = await roomService.joinRoom(userId, roomId, userName, avatar)

    ctx.body = {
      code: 200,
      msg: '聊天室加入成功',
      data: result
    }
  }

  async getRoomList(ctx, next) {
    const { roomId } = ctx.request.body
    const result = await roomService.getRoomList(roomId)

    ctx.body = {
      code: 200,
      msg: '获取聊天室列表成功',
      data: result
    }
  }

  // 发送消息
  async sendRoomMessage(ctx, next) {
    const { roomId, senderId, message, type } = ctx.request.body

    const result = await roomService.sendRoomMessage(
      roomId,
      senderId,
      message,
      type
    )

    ctx.body = {
      code: 200,
      msg: '消息发送成功'
    }
  }

  // 获取消息
  async getRoomMessage(ctx, next) {
    const { roomId } = ctx.request.body

    const result = await roomService.getRoomMessage(roomId)

    // 处理时间格式
    result.forEach(item => {
      item.sendTime = item.sentTime.toLocaleString()
    })

    ctx.body = {
      code: 200,
      msg: '消息获取成功',
      data: result
    }
  }
}

module.exports = new GroupController()
