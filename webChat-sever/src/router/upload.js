const KoaRouter = require('@koa/router')
const handleAvatar = require('../middleware/file.middleware')
const { create } = require('../controller/file.controller')
const { verifyAuth } = require('../middleware/login.middleware')

const fileRouter = new KoaRouter({ prefix: '/file' })

// 上传头像
fileRouter.post('/avatar', verifyAuth, handleAvatar, create)

module.exports = fileRouter
