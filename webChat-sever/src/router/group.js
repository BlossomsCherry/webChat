const koaRouter = require('@koa/router')
const GroupController = require('../controller/group.controller')
const { verifyAuth } = require('../middleware/login.middleware')

/* 1. 创建路由对象 */
const groupRouter = new koaRouter({ prefix: '/group' })

/* 2.定义路由映射 */
groupRouter.post('/createGroup', verifyAuth, GroupController.createGroup)
groupRouter.post('/joinGroup', verifyAuth, GroupController.joinGroup)
groupRouter.post('/searchGroup', verifyAuth, GroupController.searchGroup)
groupRouter.post(
  '/searchGroupMember',
  verifyAuth,
  GroupController.searchGroupMember
)
groupRouter.post(
  '/sendGroupMessage',
  verifyAuth,
  GroupController.sendGroupMessage
)
groupRouter.post(
  '/queryGroupMessage',
  verifyAuth,
  GroupController.queryGroupMessage
)

module.exports = groupRouter
