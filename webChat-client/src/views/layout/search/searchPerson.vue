<template>
  <div class="searchPerson" v-if="!!addFG">
    <div class="title">
      <span>搜索</span>
      <svg
        @click="addFG = 0"
        height="20"
        viewBox="0 0 20 20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"
          fill="#fff"
        ></path>
      </svg>
    </div>

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

    <el-scrollbar>
      <div class="content">
        <template v-for="(item, index) in personList" :key="index">
          <userBox :item="item" :backgroundColor="'#fff'" @click-btn="btnClick(item)"></userBox>
        </template>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import userBox from '@/components/userBox.vue'

import { onMounted, ref } from 'vue'
import { searchAllPerson, addFriend } from '@/api'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import socket from '@/utils/socket'

const userStore = useUserStore()
const { addFG } = storeToRefs(userStore)

const personList = ref<Person[]>([])

onMounted(() => {
  searchAllPerson().then((res: any) => {
    personList.value = res.data
  })
})

/**
 * 添加好友
 * @param item
 */
const btnClick = (item: Person) => {
  const userId = sessionStorage.getItem('userId')
  const socketId = sessionStorage.getItem('userSocketId')

  addFriend({ userId: Number(userId), friendId: item.id }).then((res: any) => {
    if (res.code === 200) {
      const userName: string = JSON.parse(sessionStorage.getItem('user')!).userName

      socket.emit('addFriend', { socketId, userName, friendName: item.userName })

      ElNotification({
        message: res.msg,
        type: 'success',
        position: 'top-left'
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.searchPerson {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
  width: 500px;
  height: 80%;
  border-radius: 5px;
  background: linear-gradient(to right, #2dd4bf, #22d3ee);
  overflow: hidden;

  .title {
    margin-bottom: 10px;
    text-align: center;
    color: #fff;

    svg {
      position: absolute;
      right: 20px;
      top: 10px;
      cursor: pointer;
    }
  }

  .group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    margin-bottom: 20px;

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

  .content {
    padding-bottom: 100px;
  }
}
</style>
