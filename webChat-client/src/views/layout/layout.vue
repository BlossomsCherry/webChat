<template>
  <div class="chat_layout bg-slate-200">
    <div class="wrapper-app">
      <el-container>
        <el-aside width="200px">
          <chat-aside></chat-aside>
        </el-aside>

        <!-- 聊天页组件 -->
        <layoutMsg v-if="tabsIndex === 0"></layoutMsg>

        <friend-and-group v-if="tabsIndex !== 0"></friend-and-group>
      </el-container>
    </div>

    <!-- 搜索好友/群组 -->
    <searchPerson></searchPerson>

    <!-- 创建群聊 -->
    <create-group v-if="showCreateGroup"></create-group>

    <!-- 群详细信息 -->
    <layout-group v-if="showInfo"></layout-group>
  </div>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import searchPerson from './searchPerson.vue'
import layoutMsg from './layoutMsg.vue'
import friendAndGroup from './friendAndGroup.vue'
import createGroup from './createGroup.vue'
import layoutGroup from './layoutGroup.vue'
import 'element-plus/theme-chalk/el-notification.css'

import { onUnmounted, onMounted } from 'vue'
import chatAside from '../chatAside/index.vue'
import { getFriendList, friendApplyList } from '@/api'
import { useUserStore } from '@/stores/user'
import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'
import socket from '@/utils/socket'

const userStore = useUserStore()
const commonStore = useCommonStore()
const { tabsIndex, socketId, friend_applyList, showInfo, showCreateGroup } =
  storeToRefs(commonStore)
const userId = Number(localStorage.getItem('userId'))
const { friendList, allFriendMessage } = storeToRefs(userStore)

onUnmounted(() => {
  // 组件销毁后，刷新页面
  // window.location.reload()

  allFriendMessage.value = []
})

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user')!)
  console.log(user, socket.id)

  socketId.value = socket.id!
  socket.emit('refresh', user.userName, socketId.value)

  friendApplyList(userId).then((res: any) => {
    console.log(res)
    friend_applyList.value = res.data
  })
})

/* 好友上线通知 */
socket.on('message', (userInfo: any) => {
  return
  getFriendList(userId).then((res: any) => {
    friendList.value = res.data

    ElNotification({
      message: userInfo.userName + '上线了',
      type: 'success',
      duration: 2500
    })
  })
})

/* 好友下线通知 */
socket.on('friendLeave', (userInfo: any) => {
  return
  getFriendList(userId).then((res: any) => {
    friendList.value = res.data

    ElNotification({
      message: userInfo.userName + '下线了',
      type: 'error',
      duration: 2500
    })
  })
})

socket.on('friendApply', (name: any) => {
  ElNotification({
    message: name + '发来一条好友申请',
    type: 'success',
    duration: 2500
  })
})
</script>

<style lang="scss" scoped>
:deep(.el-avatar--circle) {
  border: 2px solid #fff;
  filter: drop-shadow(0px 0px 5px #409eff);
}
:deep(.el-icon) {
  color: #74798a;
}

:deep(.el-container) {
  padding-left: 0 !important;
}

.chat_layout {
  position: relative;
  width: 100%;
  height: 100vh;

  // background-color: #979da7;

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
    background-color: #f2f2f2;

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
