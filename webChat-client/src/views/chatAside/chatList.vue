<template>
  <div class="search">
    <el-input
      v-model="search"
      size="small"
      placeholder="搜索"
      :clearable="true"
      :prefix-icon="Search"
      @focus="searchFocus"
      @clear="clearClick"
    />
    <div class="addFriend" @click="addFlag = !addFlag">
      <el-icon><Plus /></el-icon>
    </div>

    <div class="selectBox" v-if="addFlag">
      <div class="item" @click="showCreateGroup = true">发起群聊</div>
      <div class="item" @click="addClick">加好友/群</div>
    </div>
  </div>

  <el-scrollbar>
    <div class="chat-list">
      <div class="user_info" v-if="searchFlag">
        <template v-if="!!friendList.length">
          <div
            v-for="(item, index) in chatList"
            :key="item"
            :class="['user_item', { active_user_item: index == currentIndex }]"
            @click="selectPerson(index)"
          >
            <div class="avatar">
              <el-avatar :src="item.friend_avatar || item.imgurl" v-if="item.friend_avatar" />
              <div v-else class="group_avatar">
                <img v-for="(key, index) in groupUserAvatar" :key="index" :src="key" />
              </div>
              <div class="avatar_status" v-if="!!item.friend_status"></div>
            </div>
            <div class="content">
              <h5>{{ item.friendName || item.groupName }}</h5>
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
import { Search } from '@element-plus/icons-vue'
import { useCommonStore } from '@/stores/common'
import { ref, onMounted } from 'vue'
import { getFriendList, getChatMessage, searchGroup, searchGroupMember } from '@/api'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const commonStore = useCommonStore()
const { showCreateGroup, groupId, groupUserAvatar } = storeToRefs(commonStore)
const search = ref('')
const addFlag = ref(false)
const searchFlag = ref(true)
const { friendId, friendInfo, currentIndex, friendList, addFG, allFriendMessage } =
  storeToRefs(userStore)
const chatList = ref<any>([])

onMounted(async () => {
  const userId = localStorage.getItem('userId')

  if (userId) {
    await getFriendAndMsg(Number(userId))
    searchGroup(Number(userId)).then((res: any) => {
      chatList.value = friendList.value.concat(res.data)
    })

    searchGroupMember(groupId.value).then((res: any) => {
      groupUserAvatar.value = res.data.map((item: any) => item.user_avatar)
    })
  }
})

const searchFocus = () => {
  searchFlag.value = false
}

const clearClick = () => {
  searchFlag.value = true
}

/* 添加好友/群 */
const addClick = () => {
  addFG.value = 1
  addFlag.value = false
}

/**
 * 选择聊天对象
 * @param index
 */
const selectPerson = (index: number) => {
  currentIndex.value = index
  localStorage.setItem('currentIndex', currentIndex.value.toString())

  friendInfo.value = friendList.value[index]

  friendId.value = friendList.value[index]?.friendId
  groupId.value = friendList.value[index]?.group_id
  console.log(groupId.value)
}

/**
 * 获取好友列表及最新消息
 * @param userId
 */
const getFriendAndMsg = (userId: number) => {
  return new Promise((resolve) => {
    getFriendList(Number(userId)).then(async (res: any) => {
      friendList.value = res.data

      friendId.value = res.data[currentIndex.value]?.friendId

      if (res.data.length == 0) return

      // 获取最新消息
      await getChatMessage(friendList.value).then((res: any) => {
        const msg = res.data
        allFriendMessage.value = res.data
        if (msg.length === 0) return

        res.data.forEach((item: any, index: number) => {
          friendList.value[index].newMsg = item[item.length - 1]?.message
          friendList.value[index].minutes = item[item.length - 1]?.sendTime.slice(10, 15)
        })

        resolve(friendList.value)
      })
    })
  })
}
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  display: flex;
  padding: 20px 10px 10px 18px;
  background-color: #282b38;
  align-items: center;
  padding-bottom: 30px;

  .addFriend {
    display: flex;
    width: 30px;
    height: 25px;
    margin-left: 10px;
    border-radius: 3px;
    background-color: #2c313f;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    :deep(.el-icon) {
      color: #74798a;
    }
    &:hover {
      background-color: #118bfa;
      :deep(.el-icon) {
        color: #fff !important;
      }
    }
  }

  .selectBox {
    position: absolute;
    left: 145px;
    top: 50px;
    padding: 5px;
    font-size: 14px;
    border-radius: 5px;
    color: rgba(225, 225, 225, 0.9);
    background-color: #2c313f;
    z-index: 99;

    .item {
      padding: 2px 20px;
      border-radius: 3px;
      cursor: pointer;
    }
    .item:nth-child(1) {
      margin-bottom: 6px;
    }
    .item:hover {
      background-color: rgba(225, 225, 225, 0.2);
    }
  }
}
.chat-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 80px;

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

        .group_avatar {
          display: flex;
          flex-wrap: wrap;
          height: 42px;
          width: 42px;
          border-radius: 5px;
          overflow: hidden;
          img {
            width: 20px;
            height: 20px;

            &:nth-child(n) {
              margin: 0 1px 1px 0;
            }
          }
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
