<template>
  <div class="layoutGroup">
    <div v-if="groupId">
      <el-input :prefix-icon="Search" placeholder="搜索群成员"></el-input>

      <div class="allUsers grid grid-cols-4 my-5 text-center bg-white py-5 rounded-lg h-60">
        <template v-for="(item, index) in userList" :key="index">
          <div class="item cursor-pointer">
            <el-avatar shape="square" :src="item.user_avatar" />
            <span class="text-black/80 text-sm">{{ item.userName }}</span>
          </div>
        </template>
      </div>

      <span class="text-sm text-black/50">群聊名称</span>
      <input
        class="bg-white p-2 rounded-md mb-3 text-sm w-full"
        disabled
        placeholder="云曦、why、李慕婉"
      />
      <div class="bg-white p-2 rounded-md mb-3 text-sm cursor-pointer">删除聊天记录</div>

      <button class="cssbuttons-io-button w-full">
        退出群聊
        <div class="icon">
          <svg viewBox="0 0 512 512" fill="#ff4141">
            <path
              d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
            ></path>
          </svg>
        </div>
      </button>
    </div>

    <div v-else class="friend">
      <div class="bg-white p-2 rounded-md mb-3 text-sm cursor-pointer">删除聊天记录</div>
      <!-- <div class="bg-white p-2 rounded-md text-red-500 text-center text-sm cursor-pointer">
        删除好友
      </div> -->

      <button class="noselect">
        <span class="text">删除好友</span
        ><span class="icon"
          ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
            ></path></svg
        ></span>
      </button>
    </div>
  </div>
  <div class="mask" @click="showInfo = false"></div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { searchGroupMember } from '@/api'
import { onMounted, ref } from 'vue'

const commonStore = useCommonStore()
const userStore = useUserStore()
const { friendId } = storeToRefs(userStore)
const { showInfo, groupId } = storeToRefs(commonStore)
const userList = ref<userListType[]>([])

interface userListType {
  user_avatar: string
  userName: string
}

onMounted(() => {
  if (groupId.value) {
    searchGroupMember(groupId.value).then((res: any) => {
      userList.value = res.data
    })
  }
})
</script>

<style lang="scss" scoped>
.mask {
  position: absolute;
  width: 68%;
  height: 100%;
  background-color: transparent;
  z-index: 9;
}
.layoutGroup {
  position: absolute;
  padding: 20px;
  right: 15%;
  top: 18.5%;
  width: 250px;
  height: 74%;
  border-radius: 10px;
  background-color: #f2f2f2;
  box-shadow: -3px 0px 10px rgba($color: #bbbdbe, $alpha: 1);

  .cssbuttons-io-button {
    background: #a370f0;
    color: white;
    font-family: inherit;
    padding: 0.35em;
    padding-left: 1.2em;
    font-weight: 500;
    border-radius: 0.9em;
    border: none;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    box-shadow: inset 0 0 1.6em -0.6em #714da6;
    overflow: hidden;
    position: relative;
    height: 2.8em;
    padding-right: 3.3em;
    cursor: pointer;

    .icon {
      background-color: white;
      margin-left: 1em;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.2em;
      width: 2.2em;
      border-radius: 0.7em;
      box-shadow: 0.1em 0.1em 0.6em 0.2em #7b52b9;
      right: 0.3em;
      transition: all 0.3s;
    }

    &:hover .icon {
      width: calc(100% - 0.6em);
    }

    .icon svg {
      width: 1.1em;
      transition: transform 0.3s;
      color: #7b52b9;
    }

    &:hover .icon svg {
      transform: translateX(0.1em);
    }

    &:active .icon {
      transform: scale(0.95);
    }
  }

  .friend {
    button {
      width: 100%;
      height: 50px;
      cursor: pointer;
      display: flex;
      align-items: center;
      background: red;
      border: none;
      border-radius: 5px;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
      background: #e62222;
    }

    button,
    button span {
      transition: 200ms;
    }

    button .text {
      transform: translateX(35px);
      color: white;
      font-weight: bold;
    }

    button .icon {
      position: absolute;
      border-left: 1px solid #c41b1b;
      transform: translateX(150px);
      height: 40px;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button svg {
      width: 15px;
      fill: #eee;
    }

    button:hover {
      background: #ff3636;
    }

    button:hover .text {
      color: transparent;
    }

    button:hover .icon {
      width: 150px;
      border-left: none;
      transform: translateX(30px);
    }

    button:focus {
      outline: none;
    }

    button:active .icon svg {
      transform: scale(0.8);
    }
  }
}
</style>
