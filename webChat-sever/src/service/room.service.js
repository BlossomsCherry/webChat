const connection = require('../app/database')

class groupService {
  // 加群
  async joinRoom(userId, roomId, userName, avatar) {
    const statement = `INSERT INTO roomUser (userId, roomId, userName, avatar) VALUES (?, ?, ?, ?);`

    const [result] = await connection.execute(statement, [
      userId,
      roomId,
      userName,
      avatar
    ])

    return result
  }

  // 获取聊天室列表
  async getRoomList(roomId) {
    const statement = `select ru.userId,ru.userName, ru.roomId, ru.avatar,ru.joinTime, u.status, u.tag from roomUser ru
	left join user u on ru.userId=u.id
    where ru.roomId=?;`

    const [result] = await connection.execute(statement, [roomId])

    return result
  }

  //   发送消息
  async sendRoomMessage(roomId, senderId, message, type) {
    const statement = `INSERT INTO roomMessage (roomId, senderId, message, type) VALUES ( ?, ?, ?, ?);`

    const [result] = await connection.execute(statement, [
      roomId,
      senderId,
      message,
      type
    ])

    return result
  }

  // 获取消息
  async getRoomMessage(roomId) {
    const statement = `select ru.roomId, rm.senderId, rm.type, rm.message, rm.sentTime, ru.userName, ru.avatar from roomMessage rm
	left join roomUser ru on rm.senderId=ru.userId
    where ru.roomId= ?;`

    const [result] = await connection.execute(statement, [roomId])

    return result
  }
}

module.exports = new groupService()
