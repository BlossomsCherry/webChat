<template>
  <div class="search">
    <el-input
      v-model="search"
      size="small"
      placeholder="搜索"
      :clearable="true"
      @focus="searchFocus"
      @clear="clearClick"
    />
    <el-icon><Search /></el-icon>
  </div>
  <el-scrollbar>
    <div class="chat-list">
      <div class="user_info" v-if="searchFlag">
        <template v-if="!!friendList.length">
          <div
            v-for="(item, index) in friendList"
            :key="item"
            :class="['user_item', { active_user_item: index == currentIndex }]"
            @click="selectPerson(index)"
          >
            <div class="avatar">
              <el-avatar :src="item.friend_avatar" />
              <div class="avatar_status" v-if="!!item.friend_status"></div>
            </div>
            <div class="content">
              <h5>{{ item.friendName }}</h5>
              <span>{{ item.newMsg }}</span>
              <div class="date">{{ item.minutes }}</div>
            </div>
          </div>
        </template>
        <el-empty v-else description="暂无消息" image="/img/empty.png" />
      </div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getFriendList, getChatMessage } from '@/api'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const search = ref('')
const searchFlag = ref(true)
const { friendId, friendInfo, currentIndex, friendList } = storeToRefs(userStore)

onMounted(() => {
  const userId = localStorage.getItem('userId')

  if (userId) {
    getFriendAndMsg(userId)
  }
})

const searchFocus = () => {
  searchFlag.value = false
}

const clearClick = () => {
  searchFlag.value = true
}

/**
 * 选择聊天对象
 * @param index
 */
const selectPerson = (index: number) => {
  currentIndex.value = index
  localStorage.setItem('currentIndex', currentIndex.value.toString())

  friendInfo.value = friendList.value[index]

  friendId.value = friendList.value[index].friendId
}

/* 获取好友列表及最新消息 */
const getFriendAndMsg = (userId: string) => {
  getFriendList(Number(userId)).then(async (res: any) => {
    friendList.value = res.data
    console.log(friendList.value)

    friendId.value = res.data[currentIndex.value].friendId

    // 获取最新消息
    getChatMessage(friendList.value).then((res: any) => {
      const msg = res.data
      if (msg.length === 0) return

      res.data.forEach((item: any, index: number) => {
        friendList.value[index].newMsg = item[item.length - 1].message
        friendList.value[index].minutes = item[item.length - 1].sendTime.slice(10, 15)
      })
    })
  })
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  padding: 20px 10px 10px 18px;
  background-color: #282b38;
  align-items: center;

  .el-icon {
    margin-left: 10px;
    color: #74798a;
    cursor: pointer;
  }
}
.chat-list {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .user_info {
    display: flex;
    flex-direction: column;
    .user_item {
      display: flex;
      padding: 10px;
      margin: 15px 18px;
      border-radius: 8px;
      background-color: #313746;
      color: #fff;
      cursor: pointer;

      .avatar {
        position: relative;
        .avatar_status {
          position: absolute;
          top: 0px;
          right: 1px;
          width: 10px;
          height: 10px;
          background-color: #23e58a;
          // border: 3px solid #313746;
          border-radius: 50px;
        }
      }

      .content {
        position: relative;
        padding-left: 10px;
        flex: 1;
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; //当属性值为3，表示超出3行隐藏

        span {
          font-size: 12px;
        }

        .date {
          position: absolute;
          top: 0;
          right: 0;
          width: 40px;
          height: 20px;
          font-size: 12px;
          color: #fff;
        }
      }
    }
    .active_user_item {
      background-color: #118bfa;
      box-shadow: 2px 3px 8px rgba(18, 139, 250, 0.6);
    }
  }
}
</style>
