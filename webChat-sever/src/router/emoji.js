const koaRouter = require('@koa/router')
const connection = require('../app/database')
const { verifyAuth } = require('../middleware/login.middleware')

/* 1. 创建路由对象 */
const emojiRouter = new koaRouter({ prefix: '/emoji' })

/* 2.定义路由映射 */
emojiRouter.post('/', verifyAuth, async (ctx, next) => {
  const [values] = await connection.execute('select * from emoji')

  ctx.body = {
    code: 200,
    msg: '表情包获取成功',
    data: values
  }
})

module.exports = emojiRouter
