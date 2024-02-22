const app = require('../app')

const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_IS_ALREADY_EXISTS,
  NAME_IS_NOT_EXISTS,
  PASSWORD_IS_ERROR,
  UN_AUTHORIZATION
} = require('../config/error')

app.on('error', (error, ctx) => {
  let code = 9999
  let msg = '未知错误'

  switch (error) {
    case NAME_OR_PASSWORD_IS_REQUIRED:
      code = -1001
      msg = '用户名或密码不能为空'
      break
    case NAME_IS_ALREADY_EXISTS:
      code = -1002
      msg = '用户名已经存在，不能创建~'
      break
    case NAME_IS_NOT_EXISTS:
      code = -1003
      msg = '用户不存在,请检查'
      break
    case PASSWORD_IS_ERROR:
      code = -1004
      msg = '密码错误'
      break
    case UN_AUTHORIZATION:
      code = -1005
      msg = '无效token或者token已经过期'
      break
  }

  ctx.body = {
    code,
    msg
  }
})
