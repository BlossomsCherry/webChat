const koaRouter = require('@koa/router')
const RoomController = require('../controller/room.controller')
const { verifyAuth } = require('../middleware/login.middleware')

/* 1. 创建路由对象 */
const roomRouter = new koaRouter({ prefix: '/chatRoom' })

/* 2.定义路由映射 */
roomRouter.post('/joinRoom', verifyAuth, RoomController.joinRoom)
roomRouter.post('/sendRoomMessage', verifyAuth, RoomController.sendRoomMessage)
roomRouter.post('/getRoomMessage', verifyAuth, RoomController.getRoomMessage)
roomRouter.post('/getRoomList', verifyAuth, RoomController.getRoomList)

module.exports = roomRouter
