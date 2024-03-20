<template>
  <el-container>
    <el-header>
      <h2>好友通知</h2>
    </el-header>
    <el-main>
      <template v-for="(item, index) in friend_applyList" :key="index">
        <userBox :item="item">
          <el-button
            size="small"
            @click="updateState({ userId: item.userId, friendId: item.friendId, state: '0' })"
            >同意</el-button
          >
          <el-button size="small" @click="updateState(item)">拒绝</el-button>
        </userBox>
      </template>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import userBox from '@/components/userBox.vue'

import { updateFriendState } from '@/api'
import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'

const commonStore = useCommonStore()
const { friend_applyList } = storeToRefs(commonStore)

interface updateUser {
  userId: number
  friendId: number
  state: string
}

const updateState = (item: updateUser) => {
  updateFriendState(item).then((res: any) => {
    if (res.code === 200) {
      ElNotification({
        message: '好友添加成功',
        type: 'success'
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.el-header {
  flex: 1;
  color: #fff;

  h2 {
    margin-top: 20px;
  }
}
.el-main {
  flex: 6;
}
</style>
