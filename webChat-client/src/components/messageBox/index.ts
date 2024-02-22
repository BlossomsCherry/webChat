import chatMessage from './index.vue'
import type { App } from 'vue'

chatMessage.install = (app: App) => {
  app.component(chatMessage.name as string, chatMessage)
}

export default chatMessage
