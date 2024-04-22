<template>
  <el-container>
    <el-header>
      <h2 class="text-black/85 font-bold">好友申请</h2>
    </el-header>
    <el-main>
      <template v-for="(item, index) in friend_applyList" :key="index">
        <userBox :item="item" :backgroundColor="'#e8e8e8'">
          <button
            class="mr-2 text-black"
            @click="updateState({ userId: item.userId, friendId: item.friendId, state: '0' })"
          >
            同意
          </button>
          <button class="bg-red-500 text-white">拒绝</button>
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
  color: #e8e8e8;

  h2 {
    margin-top: 20px;
  }
}
.el-main {
  flex: 6;

  button {
    padding: 8px 25px;
    border: unset;
    border-radius: 15px;
    z-index: 1;
    position: relative;
    font-weight: 1000;
    font-size: 17px;
    -webkit-box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    transition: all 250ms;
    overflow: hidden;
  }

  button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    border-radius: 15px;
    background-color: #212121;
    z-index: -1;
    -webkit-box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    transition: all 250ms;
  }

  button:hover {
    color: #e8e8e8;
  }

  button:hover::before {
    width: 100%;
  }
}
</style>
