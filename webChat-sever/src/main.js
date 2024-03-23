const httpServer = require('./app')
const { SERVER_POST } = require('./config/sever')
const { Server } = require('socket.io')
require('./utils/error')

// 建立WebSocket连接
const io = new Server(httpServer)

// 在线用户列表
const onlineUsers = new Map()
const users = new Map()

io.on('connection', socket => {
  // 用户上线通知其他在线用户
  socket.on('login', user => {
    // 添加用户到在线用户列表
    users.set(user.id, user.userName)
    onlineUsers.set(socket.id, user.userName)

    socket.broadcast.emit('message', {
      userId: socket.id,
      userName: user.userName,
      status: 1
    })
  })

  socket.on('refresh', (userName, socketId) => {
    onlineUsers.set(socketId, userName)
  })

  socket.on('sendMessage', data => {
    // 将消息发送给接收者
    // const receiverSocket = users.get(data.friend_id)
    // if (receiverSocket) {
    //   socket.broadcast.emit('messageReceived', data.userId)
    // }
    socket.broadcast.emit('messageReceived', data.userId)
  })

  // 好友申请通知
  // socket.on('addFriend', data => {
  // const friendName = onlineUsers.get(socket.id)
  // console.log(data)
  // const id = getKeyByValue(onlineUsers, data.friendName)
  // console.log(id)

  // 发送好友申请通知给目标用户
  // socket.to(id).emit('friendApply', data.userName)
  // })

  // 监听客户端断开连接事件
  socket.on('disconnect', userName => {
    console.log(onlineUsers, `客户端断开连接:${socket.id}`)

    // 发送下线通知给其他在线用户
    socket.broadcast.emit('friendLeave', {
      userId: socket.id,
      userName,
      status: 0
    })
    // 从在线用户列表中移除用户
    onlineUsers.delete(socket.id)
  })

  // 监听客户端发送的心跳消息
  socket.on('heartbeat', () => {
    console.log(`收到客户端${socket.id}的心跳消息`)
    // 发送心跳响应给客户端
    socket.emit('heartbeat')
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
