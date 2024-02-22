const koaRouter = require('@koa/router')
const UserController = require('../controller/user.controller')
const { verifyUser, handlePassword } = require('../middleware/user.middleware')

/* 1. 创建路由对象 */
const useRouter = new koaRouter({ prefix: '/users' })

/* 2.定义路由映射 */
// 用户注册接口
useRouter.post('/register', verifyUser, handlePassword, UserController.create)

module.exports = useRouter
