<template>
  <div class="chat_layout">
    <div class="wrapper-app">
      <el-container>
        <el-aside width="200px">
          <chat-aside></chat-aside>
        </el-aside>
        <el-container>
          <el-header height="80px">
            <div class="name">{{ indexFriend?.userName }}</div>
            <div class="icon">
              <el-icon><MoreFilled /></el-icon>
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

                    <div class="friend_message commonMsg" v-if="item.userId == friendId">
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
      </el-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import 'element-plus/theme-chalk/el-notification.css'

import { onMounted, ref, watch, nextTick } from 'vue'
import chatAside from './chatAside/index.vue'
import EmojiBox from '@/components/EmojiBox.vue'
import { getChatMessage, addMessage, getFriendList } from '@/api'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import socket from '@/utils/socket'

const userStore = useUserStore()
const message = ref('')
const showEmoji = ref(false)
const iconList = ref(['icon-videocamera', 'icon-a-ziyuan568ldpi', 'icon-shengyinluzhi'])
const messageList: any = ref([])
const userId = Number(localStorage.getItem('userId'))
const indexFriend: any = ref([])
const { friendId, currentIndex, friendList } = storeToRefs(userStore)

socket.on('message', (name: any) => {
  getFriendList(userId).then((res: any) => {
    friendList.value = res.data

    ElNotification({
      message: name + '上线了',
      type: 'success',
      duration: 2500
    })
  })
})

socket.on('friendLeave', (name: any) => {
  getFriendList(userId).then((res: any) => {
    friendList.value = res.data

    ElNotification({
      message: name + '下线了',
      type: 'error',
      duration: 2500
    })
  })
})

onMounted(() => {
  setTimeout(() => {
    getMessage()
    indexFriend.value = friendList.value[currentIndex.value]
  }, 10)
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
  getChatMessage([{ userId: userId, friendId: friendId.value }]).then((res: any) => {
    messageList.value = res.data[0]
  })
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
    friendId: Number(userStore.friendId),
    message: item.url,
    type: type.value,
    state: 1
  }).then(() => {
    getMessage()
  })

  showEmoji.value = false
}

/* 点击发送按钮 */
const sendMessage = () => {
  type.value = 0

  addMessage({
    userId: Number(userId),
    friendId: Number(userStore.friendId),
    message: message.value,
    type: type.value,
    state: 1
  }).then(() => {
    nextTick(() => {
      getMessage()
    })
    message.value = ''
  })
}

/* 监听消息输入框键盘enter事件 */
const msgInput = () => {
  type.value = 0
  if (message.value.trim() !== '') {
    addMessage({
      userId: userId,
      friendId: friendId.value,
      message: message.value,
      type: type.value,
      state: 1
    }).then(() => {
      nextTick(() => {
        getMessage()
      })
      message.value = ''
    })
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-avatar--circle) {
  border: 2px solid #fff;
  filter: drop-shadow(0px 0px 5px #409eff);
}
:deep(.el-icon) {
  color: #74798a;
}
.chat_layout {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #979da7;
  .wrapper-app {
    position: absolute;
    width: 70%;
    height: 85%;
    min-width: 870px;
    min-height: 500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    background-color: #282b38;

    overflow: hidden;

    .el-container {
      height: 100%;
      padding: 0 20px;
      .el-aside {
        flex: 3;
        display: flex;
      }
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
    }
  }
}

:deep(.el-textarea__inner)::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

:deep(.el-textarea__inner)::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}

:deep(.el-textarea__inner)::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
