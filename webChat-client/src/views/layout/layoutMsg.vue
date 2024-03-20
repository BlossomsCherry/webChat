<template>
  <el-container>
    <el-header height="80px">
      <div class="name">{{ indexFriend?.friendName || indexFriend?.groupName }}</div>
      <div class="icon">
        <el-icon @click="showInfo = !showInfo"><MoreFilled /></el-icon>
      </div>
    </el-header>

    <el-main>
      <el-scrollbar>
        <div class="message">
          <template v-for="(item, index) in messageList" :key="index">
            <div :class="['message-item', { user: item.userId == userId }]">
              <div class="user_message commonMsg" v-if="item.userId == userId">
                <chat-message position="right" v-if="item.type === 0">
                  <span>{{ item.message }}</span>
                </chat-message>

                <img :src="item.message" v-else alt="" style="width: 100px; margin: 10px" />
              </div>

              <div class="friend_message commonMsg" v-else>
                <chat-message backgroundColor="#373d4b" v-if="item.type === 0">
                  <span>{{ item.message }}</span>
                </chat-message>

                <img :src="item.message" v-else alt="" style="width: 100px; margin: 10px" />
              </div>

              <div class="avatar">
                <div v-if="item.userId == friendId">
                  <el-avatar :src="item.userAvatar" />
                  <span class="name">{{ item.userName }}</span>
                  <span class="sendDate" style="color: #fff">{{
                    `${item.sendTime?.slice(10, 15)} AM`
                  }}</span>
                </div>

                <div v-else>
                  <span class="name" style="color: #fff">{{ item.userName }}</span>
                  <span class="sendDate">{{ `${item.sendTime?.slice(10, 15)} AM` }}</span>
                  <el-avatar :src="item.userAvatar" />
                </div>
              </div>
            </div>
          </template>
        </div>
      </el-scrollbar>
    </el-main>

    <el-footer height="150px">
      <div class="tool">
        <template v-for="(item, index) in iconList" :key="index">
          <span :class="['iconfont', item]"></span>
        </template>
      </div>
      <div class="message">
        <div class="expression">
          <div class="icon" @click="emojiClick">
            <img src="../assets/img/emoji/smiling-face.png" alt="" />
          </div>
          <emoji-box
            v-if="showEmoji"
            @sendEmoji="sendEmoji"
            @closeEmoji="showEmoji = false"
          ></emoji-box>
        </div>
        <el-input
          class="msg-input"
          maxlength="200"
          v-model="message"
          @keyup.enter.native="msgInput"
          :autosize="{ minRows: 2, maxRows: 4 }"
          resize="none"
        ></el-input>
        <div class="expression sendMsg">
          <div class="icon" @click="sendMessage">
            <img src="../assets/img/emoji/rocket.png" alt="" />
          </div>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import EmojiBox from '@/components/EmojiBox.vue'

import { addMessage, getChatMessage } from '@/api'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useCommonStore } from '@/stores/common'

import socket from '@/utils/socket'

const userStore = useUserStore()
const commonStore = useCommonStore()
const { showInfo } = storeToRefs(commonStore)
const message = ref('')
const messageList: any = ref([])
const showEmoji = ref(false)
const userId = Number(localStorage.getItem('userId'))
const iconList = ref(['icon-videocamera', 'icon-a-ziyuan568ldpi', 'icon-shengyinluzhi'])
const indexFriend: any = ref([])
const { friendId, currentIndex, allFriendMessage, friendList } = storeToRefs(userStore)

onMounted(() => {
  setTimeout(() => {
    getMessage()
    indexFriend.value = friendList.value[currentIndex.value]
  }, 100)
})

// 监听消息接收事件
socket.on('messageReceived', (senderId) => {
  console.log(`Message received from User ${senderId}`)
  // 处理接收到的消息
  // 可以在前端更新 UI 或者显示通知
  flushChatHistory()
})

/* 监听当前聊天对象变化，重新获取聊天记录 */
watch(currentIndex, () => {
  getMessage()
  indexFriend.value = friendList.value[currentIndex.value]
})

/**
 * 获取聊天记录
 */
const getMessage = () => {
  if (friendId.value === -1) return
  messageList.value = allFriendMessage.value[currentIndex.value]
}

const emojiClick = () => {
  showEmoji.value = true
}

const type = ref(0) // 消息类型
/**
 * 发送表情
 * @param item
 */
const sendEmoji = (item: any) => {
  type.value = 1
  addMessage({
    userId: userId,
    friendId: friendId.value,
    message: item.url,
    type: type.value,
    state: 1
  }).then(() => {
    socket.emit('sendMessage', { userId, friendId })
    // 发送消息后实时更新页面聊天记录
    flushChatHistory()
  })

  showEmoji.value = false
}

/* 点击发送按钮 */
const sendMessage = () => {
  type.value = 0

  if (message.value.trim() !== '') {
    addMessage({
      userId: userId,
      friendId: friendId.value,
      message: message.value,
      type: type.value,
      state: 1
    }).then(() => {
      const friend_id = friendId.value
      socket.emit('sendMessage', { userId, friend_id })
      message.value = ''

      // 发送消息后实时更新页面聊天记录
      flushChatHistory()
    })
  }
}

/**
 * 获取最新聊天记录
 */
const flushChatHistory = () => {
  getChatMessage([{ userId: userId, friendId: friendId.value }]).then((res: any) => {
    messageList.value = res.data[0]
  })
}

/* 监听消息输入框键盘enter事件 */
const msgInput = () => {
  sendMessage()
}
</script>

<style lang="scss" scoped>
.el-container {
  flex: 6;

  .el-header {
    display: flex;
    padding-top: 20px;
    justify-content: space-between;
    .name {
      flex: 1;
      color: #fff;
    }
    .icon {
      cursor: pointer;
      color: #74798a;
    }
  }
  .el-main {
    display: flex;
    border-radius: 20px;
    flex-direction: column;
    background-color: #313746;
    .message-item {
      display: flex;
      padding-top: 10px;
      margin-right: 10px;
      color: #fff;
      flex-direction: column;
      align-items: start;

      .commonMsg {
        margin: 10px 20px;
      }

      .avatar {
        margin-left: 10px;
        color: rgb(101, 104, 115);
        .name {
          margin-left: 10px;
        }
        .sendDate {
          margin: 0 10px;
          font-size: 14px;
        }
      }
    }
    .user {
      align-items: end;
    }
  }
  .el-footer {
    display: flex;
    padding: 20px;
    flex-direction: column;
    .tool {
      display: flex;
      margin-bottom: 10px;
      justify-content: end;
      .iconfont {
        margin: 0 10px;
        font-size: 20px;
        color: #74798a;
        cursor: pointer;
      }
    }
    .message {
      display: flex;
      margin-top: 10px;
      align-items: center;

      :deep(.el-input__inner) {
        height: 35px;
      }

      .expression {
        position: relative;
        display: flex;
        width: 50px;
        padding: 5px;
        line-height: 1;
        margin-right: 10px;
        border-radius: 10px;
        background-color: #313746;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .icon {
          width: 30px;
          height: 30px;

          img {
            width: 100%;
          }
        }
      }

      .sendMsg {
        margin-left: 10px;
        background-color: #118bfa;
        img {
          height: 30px;
        }
      }
    }
  }
}
</style>
