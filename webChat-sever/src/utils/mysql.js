const mysql = require('mysql2')

/* 创建数据库链接 */
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dyj.42510',
  database: 'chat'
})

/**
 * sql执行函数
 * @param {string} sql sql语句
 * @param {object} values sql语句参数
 * @returns
 */
const executeQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    // 连接数据库
    connection.connect(err => {
      if (err) {
        reject(err)
        return
      } else {
        console.log('数据库连接成功!')
      }

      // 执行sql语句
      connection.query(sql, values, (err, results, fields) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  })
}

/**
 * 查询指定表所有数据
 * @param {string} name
 * @returns
 */
const selectAll = name => {
  return new Promise((resolve, reject) => {
    connection.connect(err => {
      if (err) {
        reject(err)
      }

      const sql = `SELECT * FROM ` + name
      connection.query(sql, (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  })
}

const db = {
  executeQuery,
  selectAll
}

module.exports = {
  connection,
  db
}
