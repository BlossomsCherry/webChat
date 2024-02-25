<template>
  <div class="chatFriend">
    <div class="header">
      <div class="button" style="margin-bottom: 10px">通知</div>
      <div class="notice">
        <div :class="['item', { active: true }]">好友通知</div>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <div class="notice">
        <div class="item">群通知</div>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>

    <div class="tabs">
      <div class="fg">
        <div :class="['friend', { active: true }]">好友</div>
        <div class="group">群聊</div>
      </div>
    </div>

    <el-scrollbar>
      <div class="list">
        <template v-for="(item, index) in friendList" :Key="index">
          <div
            :class="['friend_item', { active: currentIndex === index }]"
            @click="selectFriend(index)"
          >
            <div class="avatar">
              <el-avatar :src="item.friend_avatar" />
            </div>
            <div class="right">
              <div class="top">{{ item.friendName }}</div>
              <div class="bottom">
                <span style="margin-right: 15px">[</span>
                <div
                  class="status"
                  :style="{ backgroundColor: item.friend_status ? '#23e58a' : '#b9bcc6' }"
                ></div>
                <span>{{ item.friend_status ? '在线' : '离线' }}</span>
                <span>]</span>
                <span class="tag">{{ item.tag }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFriendList } from '@/api'

const friendList: any = ref([])

onMounted(() => {
  const userId = localStorage.getItem('userId')

  getFriendList(Number(userId)).then((res: any) => {
    console.log(res)
    friendList.value = res.data
  })
})

const currentIndex = ref(Number(localStorage.getItem('friendIndex')) || -1)
const selectFriend = (index: number) => {
  localStorage.setItem('friendIndex', index.toString())
  currentIndex.value = index
}
</script>
-
<style lang="scss" scoped>
.chatFriend {
  height: 100%;
  background-color: #313746;
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    border-bottom: 1px solid #f5f5f5;

    .notice {
      display: flex;
      width: 100%;
      padding: 3px 15px;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: #2c313f;
      }
    }
    .button {
      width: 90%;
      line-height: 2;
      color: #000;
      text-align: center;
      border-radius: 5px;
      border: 1px solid #f5f5f5;
      background-color: #f5f5f5;
    }
    .item {
      padding: 10px 0;
      width: 90%;
      font-size: 14px;
      color: #fff;
    }
  }

  .tabs {
    display: flex;
    margin: 20px 0;
    width: 100%;
    justify-content: center;

    .fg {
      display: flex;
      width: 90%;
      padding: 10px;
      background-color: #282b38;
      border-radius: 5px;
      justify-content: space-between;
      align-items: center;
      .friend,
      .group {
        flex: 1;
        margin: 0 5px;
        text-align: center;
        line-height: 2;
        border-radius: 5px;
        color: #74798a;
        cursor: pointer;

        &.active {
          color: #409eff;
          background-color: #313746;
        }
      }
    }
  }
  .list {
    width: 100%;
    padding-bottom: 40px;
    .friend_item {
      display: flex;
      padding: 15px;
      cursor: pointer;
      color: #fff;
      &.active {
        background-color: #409eff !important;
      }
      &:hover {
        background-color: rgba(40, 43, 56, 0.5);
      }
      .avatar {
        margin-right: 10px;
      }
      .right {
        position: relative;
        .top {
          font-size: 14px;
        }
        .bottom {
          font-size: 12px;
          line-height: 1.5;
          .status {
            position: absolute;
            left: 6px;
            bottom: 9px;
            width: 11px;
            height: 11px;
            border-radius: 50px;
          }
          .tag {
            margin-left: 5px;
          }
        }
      }
    }
  }
}
</style>
