const fs = require('fs')
const path = require('path')

// 私钥
const PRIVATE_KEY = fs.readFileSync(
  path.resolve(__dirname, './keys/private.key')
)

// 公钥
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'))

module.exports = {
  PRIVATE_KEY,
  PUBLIC_KEY
}
