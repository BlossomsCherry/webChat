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
   * 查询所有用户
   * @returns
   */
  async searchAllPerson() {
    const statement = `SELECT * FROM user`
    const [values] = await connection.execute(statement)

    return values
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
   * 修改用户在线状态
   * @param {*} id
   * @param {*} status
   */
  async updateStatus(data) {
    const { id, status } = data
    const statement = `UPDATE user SET status = ? WHERE id = ?;`

    await connection.execute(statement, [status, id])
  }

  /**
   * 添加好友
   * @param {*} userId 用户id
   * @param {*} friendId 好友id
   * @returns
   */
  async addFriend(userId, friendId, state) {
    console.log(state)
    const statement = `INSERT INTO user_friend (userId, friendId ,state) VALUES (?, ?, ?);`

    const [values] = await connection.execute(statement, [
      userId,
      friendId,
      state
    ])

    await connection.execute(statement, [friendId, userId, 3])

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

  /**
   * 更新用户头像
   * @param {*} userId
   * @param {*} avatarUrl
   * @returns
   */
  async updateUserAvatar(userId, avatarUrl) {
    const statement = `UPDATE user SET avatar = ? WHERE id = ?;`

    const [values] = await connection.execute(statement, [avatarUrl, userId])

    return values
  }
}

module.exports = new UserService()
