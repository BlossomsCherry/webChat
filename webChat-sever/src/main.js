const app = require('./app')
const { SERVER_POST } = require('./config/sever')
require('./utils/error')

/* 启动服务器 */
app.listen(SERVER_POST, () => {
  console.log('webChat服务器启动成功~,端口3000')
})
