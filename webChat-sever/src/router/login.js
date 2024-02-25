const koaRouter = require('@koa/router')
const { sign } = require('../controller/login.controller')
const { verifyLogin } = require('../middleware/login.middleware')

const loginRouter = new koaRouter({ prefix: '/login' })

// 用户登录接口
loginRouter.post('/', verifyLogin, sign)

module.exports = loginRouter
