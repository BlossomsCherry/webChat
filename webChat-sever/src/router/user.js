const koaRouter = require('@koa/router')
const UserController = require('../controller/user.controller')
const { verifyUser, handlePassword } = require('../middleware/user.middleware')
const { verifyAuth } = require('../middleware/login.middleware')

/* 1. 创建路由对象 */
const useRouter = new koaRouter({ prefix: '/user' })

/* 2.定义路由映射 */
useRouter.post('/register', verifyUser, handlePassword, UserController.create)
useRouter.post('/searchAllPerson', verifyAuth, UserController.searchAllPerson)
useRouter.post('/search', verifyAuth, UserController.search)
useRouter.post('/addFriend', verifyAuth, UserController.addFriend)
useRouter.post(
  '/updateFriendState',
  verifyAuth,
  UserController.updateFriendState
)
useRouter.get('/getAvatar/:userId', UserController.showAvatarImage)

module.exports = useRouter
