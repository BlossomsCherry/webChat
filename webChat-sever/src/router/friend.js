const koaRouter = require('@koa/router')
const FriendService = require('../service/friend.service')
const { verifyAuth } = require('../middleware/login.middleware')

/* 1. 创建路由对象 */
const friendRouter = new koaRouter({ prefix: '/friend' })

friendRouter.post('/list', verifyAuth, async (ctx, next) => {
  const { userId } = ctx.request.body

  const result = await FriendService.selectFriend(userId)

  ctx.body = {
    code: 200,
    msg: '获取好友列表成功',
    data: result
  }
})

module.exports = friendRouter
