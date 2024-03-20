const multer = require('@koa/multer')
const { AVATAR_PATH } = require('../config/path')

// 上传头像中间件
const uploadAvatar = multer({
  dest: AVATAR_PATH
})

const handleAvatar = uploadAvatar.single('avatar')

module.exports = handleAvatar
