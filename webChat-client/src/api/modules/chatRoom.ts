import WRequest from '../request'

interface joinRoomType {
  userId: number
  roomId: string
  userName: string
  avatar: string
}

interface sendMessageType {
  roomId: string
  senderId: number
  type: number
  message: string
}

/**
 * 加入聊天室
 * @param data
 * @returns
 */
export function joinChatRoom(data: joinRoomType) {
  return WRequest.post({
    url: '/chatRoom/joinRoom',
    data
  })
}

/**
 * 获取成员列表
 * @param roomId
 * @returns
 */
export function getChatRoomList(roomId: string) {
  return WRequest.post({
    url: '/chatRoom/getRoomList',
    data: {
      roomId
    }
  })
}

/**
 * 发送消息
 * @param data
 * @returns
 */
export function sendRoomMessage(data: sendMessageType) {
  return WRequest.post({
    url: '/chatRoom/sendRoomMessage',
    data
  })
}

/**
 * 获取聊天室消息
 * @param roomId
 * @returns
 */
export function getRoomMessage(roomId: string) {
  return WRequest.post({
    url: '/chatRoom/getRoomMessage',
    data: {
      roomId
    }
  })
}
