<template>
  <div class="searchPerson" v-if="!!addFG">
    <div class="title">
      <span>搜索</span>
      <el-icon @click="addFG = 0"><Close /></el-icon>
    </div>
    <el-input placeholder="输入搜索关键词" :prefix-icon="Search" @input="searchInput"></el-input>

    <el-scrollbar>
      <div class="content">
        <template v-for="(item, index) in personList" :key="index">
          <userBox :item="item" @click-btn="btnClick(item)"></userBox>
        </template>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
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
    console.log(personList.value)
  })
})

const searchInput = () => {}

/**
 * 添加好友
 * @param item
 */
const btnClick = (item: Person) => {
  const userId = localStorage.getItem('userId')
  const socketId = localStorage.getItem('userSocketId')

  addFriend({ userId: Number(userId), friendId: item.id }).then((res: any) => {
    if (res.code === 200) {
      const userName: string = JSON.parse(localStorage.getItem('user')!).userName

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
  background-color: #fff;
  overflow: hidden;

  :deep(.el-icon) {
    position: absolute;
    right: 10px;
    font-size: 18px;
    color: #dcdfe6;
    cursor: pointer;
  }

  .title {
    margin-bottom: 10px;
    text-align: center;
    color: #fff;
  }

  .content {
    margin-top: 20px;
    padding-bottom: 50px;
    border-top: 1px solid #dcdfe6;
  }
}
</style>
