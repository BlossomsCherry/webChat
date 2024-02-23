const koaRouter = require('@koa/router')
const FriendController = require('../controller/friend.controller')
const { verifyAuth } = require('../middleware/login.middleware')

/* 1. 创建路由对象 */
const friendRouter = new koaRouter({ prefix: '/friend' })

friendRouter.post('/list', verifyAuth, FriendController.friendList)
friendRouter.post('/addMessage', verifyAuth, FriendController.addMessage)
friendRouter.post(
  '/getChatMessage',
  verifyAuth,
  FriendController.getChatMessage
)

module.exports = friendRouter
