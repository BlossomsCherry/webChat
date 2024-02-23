const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../config/secret')

class LoginController {
  sign(ctx, next) {
    const { userName, password, phone, id } = ctx.user

    // 颁发令牌，传入token
    const token = jwt.sign({ userName, password }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: 'RS256'
    })

    // 返回用户信息
    ctx.body = {
      code: 0,
      data: {
        token,
        userName,
        phone,
        id
      }
    }
  }

  test(ctx, next) {
    ctx.body = '验证身份通过'
  }
}

module.exports = new LoginController()
