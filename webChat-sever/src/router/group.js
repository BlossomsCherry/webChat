const koaRouter = require('@koa/router')
const GroupController = require('../controller/group.controller')
const { verifyAuth } = require('../middleware/login.middleware')

/* 1. 创建路由对象 */
const groupRouter = new koaRouter({ prefix: '/group' })

/* 2.定义路由映射 */
groupRouter.post('/createGroup', GroupController.createGroup)
groupRouter.post('/joinGroup', GroupController.joinGroup)
groupRouter.post('/searchGroup', GroupController.searchGroup)
groupRouter.post('/searchGroupMember', GroupController.searchGroupMember)
groupRouter.post('/sendGroupMessage', GroupController.sendGroupMessage)
groupRouter.post('/queryGroupMessage', GroupController.queryGroupMessage)

module.exports = groupRouter
