const connection = require('../app/database')

class FriendService {
  /**
   * 通过表左连接查询当前用户好友
   * @param {*} userId
   * @returns
   */
  async selectFriend(userId) {
    const statement = `SELECT * FROM user LEFT JOIN user_friend ON user.id = user_friend.userId  WHERE userId IS NOT NULL AND userId = ? AND state = '0';`

    const [values] = await connection.execute(statement, [userId])

    // 通过好友id数组查询所有好友信息
    const friendIdArr = values.map(item => item.friendId)
    const statement2 = `SELECT * FROM user WHERE id IN (${friendIdArr})`

    const [res] = await connection.execute(statement2)

    return res
  }

  /**
   * 添加聊天消息
   * @param {*} userId
   * @param {*} friendId
   * @param {*} message
   * @returns
   */
  async addMessage(userId, friendId, message, type, state) {
    const statement = `INSERT INTO friend_message (userId, friendId, message, type, state) VALUES (?, ?, ?, ?, ?);`

    const [values] = await connection.execute(statement, [
      userId,
      friendId,
      message,
      type,
      state
    ])

    return values
  }

  /**
   * 查询聊天消息
   * @param {*} userId
   * @param {*} friendId
   * @returns
   */
  async getChatMessage(userId, friendId) {
    // const statement = `select * from friend_message where userId = ? and friendId = ?;`
    const statement = `SELECT u.userName,fm.userId,fm.friendId,fm.type,fm.state,fm.message,fm.sendTime,u1.userName as friendName
	  FROM user u LEFT JOIN friend_message fm ON u.id = fm.userId
    LEFT JOIN user u1 ON u1.id = fm.friendId
    WHERE userId IS NOT NULL AND (userId = ? OR userId = ?) and ( friendId= ? or friendId = ?) ORDER BY sendTime ASC;
 `

    const [values] = await connection.execute(statement, [
      userId,
      friendId,
      userId,
      friendId
    ])

    return values
  }
}

module.exports = new FriendService()
