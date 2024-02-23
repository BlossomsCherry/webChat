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
}

module.exports = new FriendService()
