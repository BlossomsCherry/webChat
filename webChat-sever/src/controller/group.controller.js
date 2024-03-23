const groupService = require('../service/group.service')

class GroupController {
  // 创建群组
  async createGroup(ctx, next) {
    const { userId, groupName, userList } = ctx.request.body

    const result = await groupService.create(userId, groupName, userList)

    ctx.body = {
      code: 200,
      msg: '创建群聊成功'
    }
  }

  // 加入群组
  async joinGroup(ctx, next) {
    const { userId, groupId } = ctx.request.body

    const result = await groupService.joinGroup(userId, groupId)

    ctx.body = {
      code: 200,
      msg: '加入群聊成功',
      data: result
    }
  }

  // 查找群
  async searchGroup(ctx, next) {
    const { userId } = ctx.request.body

    const result = await groupService.searchGroup(userId)

    ctx.body = {
      code: 200,
      msg: '查找群聊成功',
      data: result
    }
  }

  // 查找群成员
  async searchGroupMember(ctx, next) {
    const { groupId } = ctx.request.body

    const result = await groupService.searchGroupMember(groupId)

    ctx.body = {
      code: 200,
      msg: '查找群成员成功',
      data: result
    }
  }

  // 发送群消息
  async sendGroupMessage(ctx, next) {
    const { groupId, senderId, message, type } = ctx.request.body

    const result = await groupService.sendGroupMessage(
      groupId,
      senderId,
      message,
      type
    )

    ctx.body = {
      code: 200,
      msg: '消息发送成功',
      data: result
    }
  }

  // 查询群消息
  async queryGroupMessage(ctx, next) {
    const { groupId } = ctx.request.body

    const result = await groupService.queryGroupMessage(groupId)

    // 处理时间格式
    result.forEach(item => {
      item.sendTime = item.sentTime.toLocaleString()
    })

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: result
    }
  }
}

module.exports = new GroupController()
