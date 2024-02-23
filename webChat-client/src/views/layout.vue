<template>
  <div class="chat_layout">
    <div class="wrapper-app">
      <el-container>
        <el-aside width="200px">
          <chat-aside></chat-aside>
        </el-aside>
        <el-container>
          <el-header height="80px">
            <div class="name">哇酷哇酷</div>
            <div class="icon">
              <el-icon><MoreFilled /></el-icon>
            </div>
          </el-header>
          <el-main>
            <el-scrollbar>
              <div class="message">
                <template v-for="(item, index) in messageList" :key="index">
                  <div :class="['message-item', { user: item.userId == 7 }]">
                    <div class="user_message commonMsg" v-if="item.userId == 7">
                      <chat-message position="right" v-if="item.message">
                        <span>{{ item.message }}</span>
                      </chat-message>

                      <img :src="item.emoji" alt="" style="width: 100px; margin: 10px" />
                    </div>

                    <div class="friend_message commonMsg" v-if="item.userId !== 7">
                      <chat-message backgroundColor="#373d4b" v-if="item.message">
                        <span>{{ item.message }}</span>
                      </chat-message>

                      <img :src="item.emoji" alt="" style="width: 100px; margin: 10px" />
                    </div>
                    <div class="avatar">
                      <div v-if="item.userId !== 7">
                        <el-avatar src="img/waoku.jpg" />
                        <span class="name">{{ item.userName }}</span>
                        <span class="sendDate" style="color: #fff">{{
                          `${item.sendTime.slice(10, 15)} AM`
                        }}</span>
                      </div>

                      <div v-if="item.userId == 7">
                        <span class="name" style="color: #fff">{{ item.userName }}</span>
                        <span class="sendDate">{{ `${item.sendTime.slice(10, 15)} AM` }}</span>
                        <el-avatar src="img/waoku.jpg" />
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
                  @closeEmoji="closeEmoji"
                ></emoji-box>
              </div>
              <el-input
                maxlength="200"
                v-model="message"
                :autosize="{ minRows: 2, maxRows: 4 }"
                resize="none"
              ></el-input>
            </div>
          </el-footer>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import chatAside from './chatAside/index.vue'
import EmojiBox from '@/components/EmojiBox.vue'
import { getChatMessage } from '@/api'

const message = ref('')
const showEmoji = ref(false)
const iconList = ref(['icon-videocamera', 'icon-a-ziyuan568ldpi', 'icon-shengyinluzhi'])
const messageList = ref()

onMounted(() => {
  getChatMessage({ userId: 7, friendId: 4 }).then((res: any) => {
    messageList.value = res.data
  })
})

const emojiClick = () => {
  showEmoji.value = !showEmoji.value
}

const sendEmoji = (item: string) => {
  messageList.value.push({
    id: 1,
    emoji: item,
    sendTime: new Date().toLocaleString()
  })
  showEmoji.value = false
}

const closeEmoji = () => {
  showEmoji.value = false
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
        flex: 7;

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

            .avatar {
              margin: 0 10px;
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
            padding: 10px 0;
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
            align-items: center;

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
