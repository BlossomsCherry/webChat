import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import chatUI from './components/index'
import socket from './utils/socket'

socket.io.on('reconnect_failed', () => {
  console.log('webSocket连接失败')
})

// 监听与服务器的连接状态
socket.on('connect', () => {
  localStorage.setItem('userSocketId', socket.id!)
  console.log('与服务器连接成功', socket.id)
})

// 定时发送心跳消息
const heartbeatInterval = setInterval(() => {
  socket.emit('heartbeat')
}, 30 * 1000) // 每隔 30 秒发送一次心跳消息

// 监听服务器的心跳响应
socket.on('heartbeat', () => {
  console.log('收到服务器的心跳响应')
})

socket.on('disconnect', () => {
  console.log('与服务器断开连接')
  clearInterval(heartbeatInterval) // 停止发送心跳消息
})

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(chatUI)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
