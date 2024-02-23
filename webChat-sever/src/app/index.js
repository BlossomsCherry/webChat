const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')

const useRouter = require('../router/user')
const loginRouter = require('../router/login')
const friendRouter = require('../router/friend')

// 1. 创建app
const app = new Koa()

// 2. 对app使用中间件
app.use(
  cors({
    origin: function (ctx) {
      if (ctx.url === '/test') {
        return false
      }
      return '*'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
)
app.use(bodyParser())
app.use(useRouter.routes())
app.use(useRouter.allowedMethods())
app.use(loginRouter.routes())
app.use(loginRouter.allowedMethods())
app.use(friendRouter.routes())
app.use(friendRouter.allowedMethods())

module.exports = app
