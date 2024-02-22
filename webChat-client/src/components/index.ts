//导入所有组件
import chatMessage from './messageBox/index'

const components = [chatMessage]

const install = (App: any) => {
  components.forEach((item) => {
    App.use(item)
  })
}

const chatUI = {
  install
}

export default chatUI
