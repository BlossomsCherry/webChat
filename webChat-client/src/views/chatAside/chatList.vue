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
              <el-avatar :src="item.avatar" />
            </div>
            <div class="content">
              <h5>{{ item.userName }}</h5>
              <span v-if="true">{{ item.newMsg }}</span>
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
const friendList = ref<any>([])
const newMsg = ref('')
const minutes = ref('')
const { friendId, friendInfo, currentIndex, allFriendList } = storeToRefs(userStore)

onMounted(() => {
  const userId = localStorage.getItem('userId')

  if (userId) {
    // 获取好友列表
    getFriendList(Number(userId)).then(async (res: any) => {
      allFriendList.value = res.data
      friendList.value = res.data
      console.log(res)

      friendId.value = res.data[currentIndex.value].id

      // 获取最新消息
      friendList.value.forEach((item: any) => {
        getChatMessage({ userId: Number(userId), friendId: item.id }).then((res: any) => {
          const msg = res.data.filter((item: any) => item.friendId === Number(userId))
          if (msg.length === 0) return

          newMsg.value = msg[msg.length - 1].message
          minutes.value = msg[msg.length - 1].sendTime.slice(10, 15)

          friendList.value.filter((res: any) => res.id === item.id)[0].newMsg = newMsg.value
          friendList.value.filter((res: any) => res.id === item.id)[0].minutes = minutes.value
        })
      })
    })
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

  friendId.value = friendList.value[index].id
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
