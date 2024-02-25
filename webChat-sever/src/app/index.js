const Koa = require('koa')
const { createServer } = require('http')
const { Server } = require('socket.io')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')

const useRouter = require('../router/user')
const loginRouter = require('../router/login')
const friendRouter = require('../router/friend')
const emojiRouter = require('../router/emoji')

// 1. 创建app
const app = new Koa()
const httpServer = createServer(app.callback())

// 2.建立WebSocket连接
const io = new Server(httpServer)

io.on('connection', socket => {
  // 监听用户登录
  socket.on('login', data => {
    // 接受到消息给他广播出去
    socket.broadcast.emit('message', data.userName)
  })

  socket.on('leave', data => {
    // 接受到消息给他广播出去
    socket.broadcast.emit('friendLeave', data)
  })
})

// 3. 对app使用中间件
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
app.use(emojiRouter.routes())
app.use(emojiRouter.allowedMethods())

module.exports = httpServer
