<template>
  <div class="search">
    <div class="group">
      <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
        <g>
          <path
            d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
          ></path>
        </g>
      </svg>
      <input placeholder="Search" type="search" class="input" />
    </div>

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
            v-for="(item, index) in friendList"
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
import { useCommonStore } from '@/stores/common'
import { ref, onMounted, watch } from 'vue'
import {
  getFriendList,
  getChatMessage,
  searchGroup,
  searchGroupMember,
  queryGroupMessage
} from '@/api'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const commonStore = useCommonStore()
const { showCreateGroup, groupId, groupUserAvatar, refresh } = storeToRefs(commonStore)
const addFlag = ref(false)
const searchFlag = ref(true)
const { friendId, friendInfo, currentIndex, friendList, addFG, allFriendMessage } =
  storeToRefs(userStore)

onMounted(async () => {
  const userId = sessionStorage.getItem('userId')

  if (userId) {
    await getFriendAndMsg(Number(userId))
    searchGroup(Number(userId)).then((res: any) => {
      friendList.value.push(...res.data)
    })

    searchGroupMember(groupId.value).then((res: any) => {
      groupUserAvatar.value = res.data.map((item: any) => item.user_avatar)
    })
  }
})

watch(
  () => refresh.value,
  () => {
    queryGroupMessage(groupId.value).then((res: any) => {
      allFriendMessage.value.splice(currentIndex.value, 1, res.data)
      console.log(allFriendMessage.value)
      refresh.value = false
    })
  }
)

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
  sessionStorage.setItem('currentIndex', currentIndex.value.toString())

  friendInfo.value = friendList.value[index]

  friendId.value = friendList.value[index]?.friendId
  groupId.value = friendList.value[index]?.group_id

  if (groupId.value) {
    queryGroupMessage(groupId.value).then((res: any) => {
      allFriendMessage.value.splice(index, 1, res.data)
    })
  }
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

      // 获取好友最新消息
      const arrList = friendList.value.map((item): getMessage => {
        return {
          userId: item.userId,
          friendId: item.friendId
        }
      })
      await getChatMessage(arrList).then((res: any) => {
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
  align-items: center;
  padding-bottom: 30px;

  .group {
    display: flex;
    width: 195px;
    line-height: 25px;
    align-items: center;
    position: relative;

    .input {
      width: 100%;
      height: 40px;
      line-height: 28px;
      padding: 0 1rem;
      padding-left: 2.5rem;
      border: 2px solid transparent;
      border-radius: 8px;
      outline: none;
      background-color: #f3f3f4;
      color: #0d0c22;
      transition: 0.3s ease;
    }

    .input::placeholder {
      color: #9e9ea7;
    }

    .input:focus,
    input:hover {
      outline: none;
      border-color: rgba(234, 76, 137, 0.4);
      background-color: #fff;
      box-shadow: 0 0 0 4px rgb(234 76 137 / 10%);
    }

    .icon {
      position: absolute;
      left: 1rem;
      fill: #9e9ea7;
      width: 1rem;
      height: 1rem;
    }
  }

  .addFriend {
    display: flex;
    width: 30px;
    height: 25px;
    margin-left: 10px;
    border-radius: 3px;
    background-color: #f3f3f4;
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
    top: 57px;
    padding: 5px;
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.9);
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
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
.chat-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 85px;

  .user_info {
    display: flex;
    flex-direction: column;
    .user_item {
      display: flex;
      padding: 10px;
      margin: 8px 18px;
      border-radius: 8px;
      background-color: #f2f2f2;
      color: #000;
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
        }
      }
    }
    .active_user_item {
      color: #fff !important;
      background-color: #118bfa;
      box-shadow: 2px 3px 8px rgba(18, 139, 250, 0.6);
    }
  }
}
</style>
