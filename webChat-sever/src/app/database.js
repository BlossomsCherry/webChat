const mysql = require('mysql2')

// 1. 创建连接池
const connectionPool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'dyj.42510',
  database: 'chat',
  connectionLimit: 5
})

// 获取连接是否成功
connectionPool.getConnection((err, connection) => {
  // 1. 判断是否有错误信息
  if (err) {
    console.log('数据库连接失败!', err)
    return
  }

  // 2. 获取connection，尝试和数据库建立连接
  connection.connect(err => {
    if (err) {
      console.log('数据库交互失败!', err)
      return
    } else {
      console.log('数据库连接成功~,可以操作数据库了~')
    }
  })
})

const connection = connectionPool.promise()

module.exports = connection
