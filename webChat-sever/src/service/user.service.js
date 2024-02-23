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
    // const [res] = connection.execute('select * from user')

    // console.log(res)
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

  /**
   * 添加好友
   * @param {*} userId 用户id
   * @param {*} friendId 好友id
   * @returns
   */
  async addFriend(userId, friendId, state) {
    const statement = `INSERT INTO user_friend (userId, friendId ,state) VALUES (?, ?, ?);`

    const [values] = await connection.execute(statement, [
      userId,
      friendId,
      state
    ])
    return values
  }

  /**
   * 查询与目标用户好友状态
   * @param {*} userId
   */
  async isFriend(userId, friendId) {
    const statement = `SELECT * FROM user_friend WHERE userId = ? AND friendId = ?;`

    const [values] = await connection.execute(statement, [userId, friendId])

    return values
  }

  /**
   * 更新好友关系
   * @param {*} friendId
   * @param {*} userId
   * @param {*} state
   * @returns
   */
  async updateFriendState(friendId, userId, state) {
    const statement = `UPDATE user_friend SET state = ? WHERE friendId = ? AND userId = ?;`

    const [values] = await connection.execute(statement, [
      state,
      friendId,
      userId
    ])

    return values
  }
}

module.exports = new UserService()
