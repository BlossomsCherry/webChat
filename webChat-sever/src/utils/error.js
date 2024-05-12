const { app } = require('../app')

const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_IS_ALREADY_EXISTS,
  NAME_IS_NOT_EXISTS,
  PASSWORD_IS_ERROR,
  UN_AUTHORIZATION
} = require('../config/error')

app.on('error', (error, ctx) => {
  let code = 9999
  let msg = '未知错误，请联系管理员~'

  switch (error.message) {
    case NAME_OR_PASSWORD_IS_REQUIRED.message:
      code = -1001
      msg = '用户名或密码不能为空~'
      break
    case NAME_IS_ALREADY_EXISTS.message:
      code = -1002
      msg = '用户名已经存在，不能创建~'
      break
    case NAME_IS_NOT_EXISTS.message:
      code = -1003
      msg = '用户不存在，请重新输入！'
      break
    case PASSWORD_IS_ERROR.message:
      code = -1004
      msg = '密码错误，请重新输入！'
      break
    case UN_AUTHORIZATION.message:
      code = -1005
      msg = '无效token或者token已经过期'
      break
  }

  ctx.body = {
    code,
    msg
  }
})
