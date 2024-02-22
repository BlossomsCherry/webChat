const crypto = require('crypto')

/**
 * 加密算法
 * @param {*} password
 * @returns
 */
function md5password(password) {
  // 加密
  const md5 = crypto.createHash('md5')

  // 转换为16进制
  const md5pwd = md5.update(password).digest('hex')

  return md5pwd
}

module.exports = md5password
