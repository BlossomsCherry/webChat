<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'
import { getChatRoomList } from '@/api'

const { roomId } = storeToRefs(useCommonStore())
const userList = ref<any>([])
const selectIndex = ref(0)
const user = JSON.parse(sessionStorage.getItem('user')!)

onMounted(() => {
  getChatRoomList(roomId.value).then((res: any) => {
    res.data.forEach((item: any, index: number, arr: any) => {
      if (item.userId == user.id) {
        arr.splice(index, 1)
      }
    })
    userList.value = res.data
  })
})
</script>

<template>
  <div class="p-5">
    <h2>在线用户</h2>
  </div>

  <div>
    <ul>
      <li
        v-for="(item, index) in userList"
        :key="item.userName"
        :class="[
          'relative flex px-4 py-2 cursor-pointer rounded-md',
          selectIndex === index ? 'bg-sky-900/75 text-white' : ''
        ]"
        @click="selectIndex = index"
      >
        <div class="avatar pr-3">
          <el-avatar :src="item.avatar" />
        </div>
        <div class="right relative flex-col">
          <div class="top text-sm">{{ item.userName }}</div>
          <div class="bottom flex text-xs">
            <span style="margin-right: 15px">[</span>
            <div
              class="status absolute left-1 bottom-3 w-3 h-3 rounded-full"
              :style="{ backgroundColor: item.status === 1 ? '#23e58a' : '#b9bcc6' }"
            ></div>
            <span>{{ item.status === 1 ? '在线' : '离线' }}</span>
            <span>]</span>
            <span class="tag ml-1">{{ item.tag }}</span>
          </div>
        </div>

        <a href="javascript:;" :class="['absolute inset-0 rounded-md']" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>
