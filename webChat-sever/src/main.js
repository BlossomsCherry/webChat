const { httpServer } = require('./app')
const { SERVER_POST } = require('./config/sever')
const { Server } = require('socket.io')
require('./utils/error')

// 建立WebSocket连接
const io = new Server(httpServer)

io.on('connection', socket => {
  // 用户上线通知好友
  socket.on('login', ({ id: friendID, userName: friendName }) => {
    socket.broadcast.emit('friendOnline', {
      friendID,
      friendName,
      status: 1
    })
  })

  socket.on('sendMessage', data => {
    // 将消息发送给接收者
    socket.broadcast.emit('messageReceived', data.userId)
  })

  socket.on('leave', ({ userName, id }) => {
    // 发送下线通知给其他在线用户
    socket.broadcast.emit('friendLeave', {
      userName,
      id,
      status: 0
    })
  })

  // 监听客户端断开连接事件
  // socket.on('disconnect', () => {})

  // 监听客户端发送的心跳消息
  socket.on('heartbeat', () => {
    console.log(`收到客户端${socket.id}的心跳消息`)
    // 发送心跳响应给客户端
    socket.emit('heartbeat')
  })

  /* ---------------------------------- 聊天室 ---------------------------------- */
  socket.on('joinChatRoom', ({ roomId, userName }) => {
    socket.join(roomId)
    io.to(roomId).emit('joinChatRoom', userName)
  })

  socket.on('leaveChatRoom', ({ roomId, userName }) => {
    io.to(roomId).emit('leaveChatRoom', userName)
  })

  socket.on('getMessage', roomId => {
    io.to(roomId).emit('getMessage', roomId)
  })

  /* ---------------------------------- 视频通话 ---------------------------------- */
  // 弹出视频通话
  socket.on('showVideo', ({ callId, friendId, userName, avatar }) => {
    socket.broadcast.emit('showVideo', { callId, friendId, userName, avatar })
  })

  // 监听加入房间事件
  socket.on('joinRoom', roomId => {
    socket.join(roomId) // 加入房间
  })

  socket.on('callRemote', roomId => {
    // 向房间内所有人进行广播
    io.to(roomId).emit('callRemote')
  })

  socket.on('acceptCall', roomId => {
    io.to(roomId).emit('acceptCall')
  })

  // 接收offer
  socket.on('sendOffer', ({ offer, roomId }) => {
    io.to(roomId).emit('sendOffer', offer)
  })

  // 接收answer
  socket.on('sendAnswer', ({ answer, roomId }) => {
    io.to(roomId).emit('sendAnswer', answer)
  })

  // 接收candidate
  socket.on('sendCandidate', ({ candidate, roomId }) => {
    io.to(roomId).emit('sendCandidate', candidate)
  })

  // 挂断视频
  socket.on('hangup', roomId => {
    io.to(roomId).emit('hangup')
  })
})

/* 启动服务器 */
httpServer.listen(SERVER_POST, () => {
  console.log('webChat服务器启动成功~,端口：' + SERVER_POST)
})
