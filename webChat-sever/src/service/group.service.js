const connection = require('../app/database')

class groupService {
  // 建群
  async create(userId, groupName, userList) {
    const statement = `INSERT INTO \`group\` (userId, groupName) VALUES (?, ?);`
    const statement1 = `INSERT INTO group_user (user_id, group_id) VALUES (?, ?);`

    const [result] = await connection.execute(statement, [userId, groupName])

    // 群id
    const groupId = result.insertId

    // 将所有用户加入群组
    let i = 0
    while (i < userList.length) {
      await connection.execute(statement1, [userList[i], groupId])
      i++
    }

    return result
  }

  // 加群
  async joinGroup(userId, groupId) {
    const statement = `INSERT INTO group_user (user_id, group_id) VALUES (?, ?);`

    const [result] = await connection.execute(statement, [userId, groupId])

    return result
  }

  // 查找群
  async searchGroup(userId) {
    const statement = `SELECT g.groupName, g.userId, g.group_id, g.notice, g.createTime, g.imgurl FROM \`group\` g
	  LEFT JOIN group_user gu ON gu.group_id=g.group_id
    WHERE gu.user_id=7;`

    const [result] = await connection.execute(statement, [userId])

    return result
  }

  // 查找群成员
  async searchGroupMember(groupId) {
    const statement = `SELECT u.userName, u.avatar user_avatar, gu.user_id, gu.joinTime FROM user u
	  LEFT JOIN group_user gu ON gu.user_id = u.id
    WHERE gu.group_id = 18;`

    const [result] = await connection.execute(statement, [groupId])

    return result
  }

  // 发送群消息
  async sendGroupMessage(groupId, senderId, message, type) {
    const statement = `INSERT INTO group_message (groupId, senderId, message, type) VALUES ( ?, ?, ?, ?);`

    const [result] = await connection.execute(statement, [
      groupId,
      senderId,
      message,
      type
    ])

    return result
  }

  // 查询群消息
  async queryGroupMessage(groupId) {
    const statement = `SELECT gm.groupId, gm.senderId userId, gm.message, gm.sentTime, gm.type, u.userName, u.avatar userAvatar 
	FROM group_message gm
	left join \`user\` u on gm.senderId = u.id
	WHERE groupId = ?`

    const [result] = await connection.execute(statement, [groupId])

    return result
  }
}

module.exports = new groupService()
