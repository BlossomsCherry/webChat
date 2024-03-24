<template>
  <el-container>
    <el-header height="80px">
      <div class="name font-bold text-black/90">
        {{ indexFriend?.friendName || indexFriend?.groupName }}
      </div>
      <div class="icon">
        <el-icon @click="showInfo = !showInfo"><MoreFilled /></el-icon>
      </div>
    </el-header>

    <el-main>
      <el-scrollbar ref="chatBoxRef">
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
                <chat-message backgroundColor="#373d4b" v-if="item?.type === 0">
                  <span>{{ item.message }}</span>
                </chat-message>

                <img :src="item.message" v-else alt="" style="width: 100px; margin: 10px" />
              </div>

              <div class="avatar">
                <div v-if="item.userId !== userId">
                  <el-avatar :src="item.userAvatar" />
                  <span class="name">{{ item.userName }}</span>
                  <span class="sendDate" style="color: #08d9d6">{{
                    `${item.sendTime?.slice(10, 15)} AM`
                  }}</span>
                </div>

                <div v-else>
                  <span class="name" style="color: #08d9d6">{{ item.userName }}</span>
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
          <span :class="['iconfont', item]" @click="toolClick(index)"></span>
        </template>
      </div>
      <div class="message">
        <div class="expression">
          <div class="icon" @click="emojiClick">
            <img src="../../assets/img/emoji/smiling-face.png" alt="" />
          </div>
          <emoji-box
            v-if="showEmoji"
            @sendEmoji="sendEmoji"
            @closeEmoji="showEmoji = false"
          ></emoji-box>
        </div>

        <div class="input-container w-full">
          <input
            type="textarea"
            v-model="message"
            @keyup.enter="msgInput"
            class="input w-full"
            placeholder="Enter text"
          />
          <div class="highlight"></div>
        </div>

        <div class="expression sendMsg">
          <div class="icon" @click="sendMessage">
            <img src="../../assets/img/emoji/rocket.png" alt="" />
          </div>
        </div>
      </div>
    </el-footer>
  </el-container>

  <videoBox v-if="showVideo" ref="videoRef" v-model="showVideo"></videoBox>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick, computed } from 'vue'
import EmojiBox from '@/components/EmojiBox.vue'
import videoBox from './videoBox.vue'

import { addMessage, getChatMessage, sendGroupMessage } from '@/api'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useCommonStore } from '@/stores/common'
import socket from '@/utils/socket'

const userStore = useUserStore()
const commonStore = useCommonStore()
const { showInfo, refresh } = storeToRefs(commonStore)
const message = ref('')
const showEmoji = ref(false)
const userId = Number(localStorage.getItem('userId'))
const iconList = ref(['icon-videocamera', 'icon-a-ziyuan568ldpi', 'icon-shengyinluzhi'])
const indexFriend: any = ref([])
const { friendId, currentIndex, allFriendMessage, friendList } = storeToRefs(userStore)
const messageList = computed(() => {
  return allFriendMessage.value[currentIndex.value]
})

onMounted(() => {
  setTimeout(() => {
    scrollToBottom()
    indexFriend.value = friendList.value[currentIndex.value]
  }, 200)
})

// 监听消息接收事件
socket.on('messageReceived', (senderId) => {
  console.log(`Message received from User ${senderId}`)
  // 处理接收到的消息
  flushChatHistory()
})

/* 监听当前聊天对象变化，重新获取聊天记录 */
watch(
  () => currentIndex.value,
  () => {
    scrollToBottom()
    indexFriend.value = friendList.value[currentIndex.value]
  }
)

/* 群消息 */
watch(
  () => refresh.value,
  () => scrollToBottom()
)

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
  if (!friendList.value[currentIndex.value].group_id) {
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
  } else {
    sendGroupMessage({
      groupId: friendList.value[currentIndex.value].group_id,
      senderId: userId,
      message: item.url,
      type: type.value
    }).then(() => {
      socket.emit('sendMessage', { userId, friendId })
      message.value = ''

      refresh.value = true
    })
  }

  showEmoji.value = false
}

/* 点击发送按钮 */
const sendMessage = () => {
  console.log(message.value)
  type.value = 0

  if (message.value.trim() !== '') {
    if (!friendList.value[currentIndex.value].group_id) {
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
    } else {
      sendGroupMessage({
        groupId: friendList.value[currentIndex.value].group_id,
        senderId: userId,
        message: message.value,
        type: type.value
      }).then(() => {
        socket.emit('sendMessage', { userId, friendId })
        message.value = ''

        refresh.value = true
      })
    }
  }
}

/**
 * 获取最新聊天记录
 */
const flushChatHistory = () => {
  const arrList = friendList.value.map((item): getMessage => {
    return {
      userId: item.userId,
      friendId: item.friendId
    }
  })
  arrList.forEach((item, index) => {
    if (!item.friendId) arrList.splice(index, 1)
  })
  getChatMessage(arrList).then((res: any) => {
    allFriendMessage.value = res.data
    scrollToBottom()
  })
}

/* 监听消息输入框键盘enter事件 */
const msgInput = () => {
  sendMessage()
}

const chatBoxRef: any = ref(null)
/**
 * 自动滚动到聊天框底部
 */
const scrollToBottom = () => {
  nextTick(() => {
    const element = chatBoxRef.value.$el.querySelector('.el-scrollbar__wrap')
    element.scrollTop = element.scrollHeight
  })
}

/**
 * 工具栏点击
 */
const videoRef = ref<any>(null)
const showVideo = ref<boolean>(false)
const toolClick = (index: number) => {
  console.log(friendId.value)
  if (index === 0) {
    socket.emit('showVideo', friendId.value)

    showVideo.value = true
    setTimeout(() => {
      videoRef.value.callRemote()
    }, 500)
  }
}

// 监听是否弹出视频通话
socket.on('showVideo', (friendId1) => {
  // if (friendId1 === userId) {
  showVideo.value = true
  // }
})
</script>

<style lang="scss" scoped>
.el-container {
  flex: 6;
  margin-left: 20px;

  .el-header {
    display: flex;
    padding-top: 20px;
    justify-content: space-between;
    .name {
      flex: 1;
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
    background-color: #fff;
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

      .expression {
        position: relative;
        display: flex;
        width: 50px;
        padding: 5px;
        line-height: 1;
        margin-right: 10px;
        border-radius: 10px;
        // background-color: #313746;
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
