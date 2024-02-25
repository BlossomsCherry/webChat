const koaRouter = require('@koa/router')
const { sign, test } = require('../controller/login.controller')
const { verifyLogin, verifyAuth } = require('../middleware/login.middleware')

const loginRouter = new koaRouter({ prefix: '/login' })

// 用户登录接口
loginRouter.post('/', verifyLogin, sign)
// loginRouter.post('/test', verifyAuth, test)

module.exports = loginRouter
