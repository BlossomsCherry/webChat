<script setup lang="ts">
import { onMounted, ref } from 'vue'
import socket from '@/utils/socket'
import { joinChatRoom, sendRoomMessage, getRoomMessage, getChatRoomList } from '@/api'
import EmojiBox from '@/components/EmojiBox.vue'

const roomId = ref('10001') // 房间号
const showEmoji = ref(false)
const IsMask = ref(
  sessionStorage.getItem('isMask') ? !!Number(sessionStorage.getItem('isMask')) : true
) // 遮罩
const user = JSON.parse(sessionStorage.getItem('user')!)
const totalPerson = ref(98)
const chatMessage = ref<any>([])

onMounted(() => {
  getChatRoomList(roomId.value).then((res: any) => {
    const flag = res.data.map((item: any) => item.userId).includes(user.id)

    if (!flag) {
      joinChatRoom({
        userId: user.id,
        roomId: roomId.value,
        userName: user.userName,
        avatar: user.avatar
      })
    }
  })

  getMessage()

  socket.on('joinChatRoom', (userName) => {
    chatMessage.value.push({
      typeMsg: 'joinInfo',
      name: userName
    })
  })

  socket.on('leaveChatRoom', (userName) => {
    chatMessage.value.push({
      typeMsg: 'leaveInfo',
      name: userName
    })
  })

  socket.on('getMessage', () => {
    getMessage()
  })
})

// 加入房间
const joinRoom = () => {
  socket?.emit('joinChatRoom', { roomId: roomId.value, userName: user.userName })

  IsMask.value = false
  sessionStorage.setItem('isMask', '0')
}

// 离开房间
const leaveRoom = () => {
  socket?.emit('leaveChatRoom', { roomId: roomId.value, userName: user.userName })

  IsMask.value = true
  sessionStorage.setItem('isMask', '1')
}

// 发送消息
const message = ref('')
const sendMessage = () => {
  sendRoomMessage({
    roomId: roomId.value,
    senderId: user.id,
    type: 0,
    message: message.value
  }).then((res: any) => {
    if (res.code === 200) {
      socket.emit('getMessage', roomId.value)
      clearMessage()
    }
  })
}

/**
 * 发送表情
 * @param item
 */
const sendEmoji = (item: any) => {
  sendRoomMessage({
    senderId: user.id,
    roomId: roomId.value,
    message: item.url,
    type: 1
  }).then(() => {
    socket.emit('getMessage', roomId.value)
  })

  showEmoji.value = false
}

/**
 * 获取消息
 */
const getMessage = () => {
  return new Promise((resolve) => {
    getRoomMessage(roomId.value).then((res: any) => {
      res.data.forEach((item: any) => {
        item.typeMsg = 'message'
        if (item.senderId == user.id) {
          item.userType = 0
        } else {
          item.userType = 1
        }
      })
      chatMessage.value.push(...res.data)
    })
    resolve(chatMessage.value)
  })
}

/**
 * 清空消息
 */
const clearMessage = () => {
  message.value = ''
}
</script>

<template>
  <div style="flex: 6" class="flex flex-col">
    <div class="py-5 flex mx-4 justify-between">
      <div class="flex">
        <span class="bg-black text-white inline-block rounded-md px-1 mr-2 text-sm"
          >ID:{{ roomId }}</span
        >
        <h1 class="text-center font-bold">{{ `UU聊天室(${totalPerson})` }}</h1>
      </div>

      <div class="icon w-5 mr-1 cursor-pointer" @click="leaveRoom">
        <svg viewBox="0 0 512 512">
          <path
            d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
          ></path>
        </svg>
      </div>
    </div>

    <!-- 聊天显示区 -->
    <div id="box" class="p-3 m-4 h-3/4 bg-white overflow-y-auto">
      <template v-for="(item, index) in chatMessage" :key="index">
        <div
          v-if="item.typeMsg === 'message'"
          :class="['flex flex-col', item.userType === 0 ? 'items-end' : 'items-start']"
        >
          <div
            v-if="item.type === 0"
            :class="[
              ' px-3 py-2 rounded-t-2xl max-w-80 break-words text-roomName-color',
              item.userType === 0 ? 'rounded-bl-2xl' : 'rounded-br-2xl',
              item.userType === 0 ? 'bg-roomMessage1-color' : 'bg-roomMessage2-color'
            ]"
          >
            <span>{{ item.message }}</span>
          </div>

          <img :src="item.message" v-else alt="" style="width: 100px; margin: 10px" />

          <div class="mt-2" v-if="item.userType === 1">
            <el-avatar :src="item.avatar" />
            <span class="mx-2 text-roomName-color">{{ item.userName }}</span>
            <span class="text-roomDate-color">{{ item.sendTime?.slice(10, 15) }}</span>
          </div>

          <div class="mt-2" v-else>
            <span
              :class="['mx-2', item.userType === 1 ? 'text-roomName-color' : 'text-roomDate-color']"
              >{{ item.userName }}</span
            >
            <span :class="[item.userType === 0 ? 'text-roomName-color' : 'text-roomDate-color']">{{
              item.sendTime?.slice(10, 15)
            }}</span>
            <el-avatar :src="item.avatar" alt="" />
          </div>
        </div>

        <!-- 进入聊天室提示 -->
        <div
          v-if="item.typeMsg === 'joinInfo'"
          class="w-44 m-auto text-center text-roomName-color bg-roomMessage2-color rounded-md px-2 my-2 text-sm p-0.5"
        >
          <em class="text-red-400">{{ item.name }}</em>
          <span> 加入聊天室~</span>
        </div>

        <!-- 退出聊天室提示 -->
        <div
          v-if="item.typeMsg === 'leaveInfo'"
          class="w-44 m-auto text-center text-roomName-color bg-roomMessage2-color rounded-md px-2 my-2 text-sm p-0.5"
        >
          <em class="text-red-400">{{ item.name }}</em>
          <span> 离开了聊天室~</span>
        </div>

        <!-- 房间公告 -->
        <div
          v-if="item.typeMsg === 'notice'"
          class="flex flex-col justify-center bg-roomMessage2-color w-2/3 m-auto p-2 rounded-lg"
        >
          <div class="text-blue-400 text-sm">房间公告</div>
          <div>.............</div>
          <div class="text-blue-400 text-sm">房间公告</div>
          <div>.............</div>
          <div class="text-blue-400 text-sm">房间公告</div>
          <div>.............</div>
        </div>
      </template>
    </div>

    <!-- 文本输入区 -->
    <div class="h-40 mx-4 flex flex-col justify-start">
      <div class="w-8 cursor-pointer mb-3 relative">
        <div class="icon" @click="showEmoji = !showEmoji">
          <img src="../../../assets/img/emoji/smiling-face.png" alt="" />
        </div>
        <emoji-box
          v-show="showEmoji"
          @sendEmoji="sendEmoji"
          @closeEmoji="showEmoji = false"
        ></emoji-box>
      </div>

      <div class="input-container w-full">
        <input
          type="textarea"
          v-model="message"
          class="input w-full"
          placeholder="Enter text"
          @keyup.enter="sendMessage"
        />
        <div class="highlight"></div>
      </div>
    </div>

    <!-- 遮罩 -->
    <div v-if="IsMask" class="w-full h-full bg-black/50 absolute backdrop-blur-sm">
      <button class="cssbuttons-io-button absolute top-1/2 left-1/4" @click="joinRoom">
        进入聊天室~
        <div class="icon">
          <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 设置浏览器滚动条样式 */
#box::-webkit-scrollbar {
  width: 6px;
  /* 滚动条宽度 */
}

#box::-webkit-scrollbar-thumb {
  /* 滚动条拖动部分的颜色 */
  background-color: #f2f2f2;
  /* 滚动条设置为圆角 */
  -webkit-border-radius: 5px;
}

#box:hover::-webkit-scrollbar-thumb {
  background-color: #dddee0;
}

.icon svg:hover {
  fill: #ff4141;
}

.input-container {
  position: relative;
}

.input {
  font-size: 1em;
  padding: 0.6em 1em;
  border: none;
  border-radius: 6px;
  background-color: #f8f8f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  color: #333;
}

.input:hover {
  background-color: #f2f2f2;
}

.input:focus {
  outline: none;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input::placeholder {
  color: #999;
}

.highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #6c63ff;
  transition: width 0.3s ease;
}

.input:focus + .highlight {
  width: 100%;
}

/* Optional: Animation on focus */
@keyframes input-focus {
  from {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
  }

  to {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.input:focus {
  animation: input-focus 0.3s ease;
}

.cssbuttons-io-button {
  background: #28282d;
  color: white;
  font-family: inherit;
  padding: 0.35em;
  padding-left: 1.2em;
  font-size: 17px;
  font-weight: 500;
  border-radius: 0.9em;
  border: none;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  box-shadow: inset 0 0 1.6em -0.6em #714da6;
  overflow: hidden;
  position: relative;
  height: 2.8em;
  padding-right: 3.3em;
  cursor: pointer;
}

.cssbuttons-io-button .icon {
  background: white;
  margin-left: 1em;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.2em;
  width: 2.2em;
  border-radius: 0.7em;
  box-shadow: 0.1em 0.1em 0.6em 0.2em #28282d;
  right: 0.3em;
  transition: all 0.3s;
}

.cssbuttons-io-button:hover .icon {
  width: calc(100% - 0.6em);
}

.cssbuttons-io-button .icon svg {
  width: 1.1em;
  transition: transform 0.3s;
  color: #7b52b9;
}

.cssbuttons-io-button:hover .icon svg {
  transform: translateX(0.1em);
}

.cssbuttons-io-button:active .icon {
  transform: scale(0.95);
}
</style>
