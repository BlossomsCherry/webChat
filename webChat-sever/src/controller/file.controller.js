const fileService = require('../service/file.service')
const UserService = require('../service/user.service')

class FileController {
  async create(ctx, next) {
    // 1.获取文件信息
    const { filename, mimetype, size } = ctx.request.file
    const { id } = ctx.user

    // 2.将文件信息保存到数据库中
    const result = await fileService.create(filename, mimetype, size, id)

    // 3.将头像的地址，保存到user表中
    const avatarUrl = `http://localhost:3000/user/getAvatar/${id}`
    const result2 = await UserService.updateUserAvatar(id, avatarUrl)

    // 3.返回结果
    ctx.body = {
      code: 200,
      msg: '文件上传成功',
      data: avatarUrl
    }
  }
}

module.exports = new FileController()
