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
friendRouter.post('/friendApply', verifyAuth, FriendController.friendApplyList)
friendRouter.post(
  '/updateFriendState',
  verifyAuth,
  FriendController.updateFriendState
)

module.exports = friendRouter
