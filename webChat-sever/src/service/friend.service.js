const connection = require('../app/database')

class FriendService {
  /**
   * 通过表左连接查询当前用户好友
   * @param {*} userId
   * @returns
   */
  async selectFriend(userId, state) {
    // const statement = `SELECT * FROM user LEFT JOIN user_friend ON user.id = user_friend.userId  WHERE userId IS NOT NULL AND userId = ? AND state = '0';`
    const statement = `SELECT u.userName, u1.userName friendName, u.id userId, u1.id friendId, u1.status friend_status, u1.avatar friend_avatar, u1.createTime, u1.phone friend_phone, state
	  FROM user u
	  LEFT JOIN user_friend fm ON u.id = fm.userId
    LEFT JOIN user u1 ON fm.friendId = u1.id
	  WHERE userId  IS NOT NULL AND userId = ? AND state = ?;`

    const [values] = await connection.execute(statement, [userId, state])

    // 通过好友id数组查询所有好友信息
    if (values.length === 0) return []

    return values
  }

  async friendApplyList(userId, friendId) {}

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
  async getChatMessage(friendList) {
    const statement = `SELECT u.userName, u.avatar as userAvatar,fm.userId,fm.friendId,fm.type,fm.state,fm.message,fm.sendTime,u1.userName as friendName,u1.avatar as friendAvatar
	  FROM user u LEFT JOIN friend_message fm ON u.id = fm.userId
    LEFT JOIN user u1 ON u1.id = fm.friendId
    WHERE userId IS NOT NULL AND (userId = ? OR userId = ?) and ( friendId= ? or friendId = ?) ORDER BY sendTime ASC;
 `

    let i = 0
    let result = []
    while (i < friendList.length) {
      const [values] = await connection.execute(statement, [
        friendList[i].userId,
        friendList[i].friendId,
        friendList[i].userId,
        friendList[i].friendId
      ])
      i++
      result.push(values)
    }

    return result
  }
}

module.exports = new FriendService()
