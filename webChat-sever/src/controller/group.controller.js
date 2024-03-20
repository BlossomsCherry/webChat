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
}

module.exports = new GroupController()
