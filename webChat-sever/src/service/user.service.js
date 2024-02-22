const connection = require('../app/database')

class UserService {
  /**
   * 创建用户
   * @param {*} user
   * @returns
   */
  async create(user) {
    // 1.获取用户user
    const { userName, password } = user

    // 2.拼接statement
    const statement = `INSERT INTO user (userName, password) VALUES (?, ?);`

    // 3.执行sql语句
    const [result] = await connection.execute(statement, [userName, password])

    return result
  }

  /**
   * 数据库查询用户名是否存在
   * @param {*} userName
   * @returns
   */
  async findUserByName(userName) {
    const statement = `SELECT * FROM user WHERE userName = ?`

    const [values] = await connection.execute(statement, [userName])
    return values
  }
}

module.exports = new UserService()
