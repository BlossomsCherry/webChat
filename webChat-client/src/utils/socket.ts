import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  transports: ['websocket'], // 指定传输方式，如WebSocket
  autoConnect: true, // 是否自动连接
  reconnection: true, // 是否自动重新连接
  reconnectionAttempts: 3, // 重新连接尝试次数
  reconnectionDelay: 1000 // 重新连接延迟时间（毫秒）
})

export default socket
