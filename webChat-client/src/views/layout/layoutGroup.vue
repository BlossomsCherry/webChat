<template>
  <div class="layoutGroup">
    <el-input :prefix-icon="Search" placeholder="搜索群成员"></el-input>

    <div class="allUsers">
      <template v-for="(item, index) in userList" :key="index">
        <div class="item">
          <el-avatar shape="square" :src="item.user_avatar" />
          <span>{{ item.userName }}</span>
        </div>
      </template>
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
  searchGroupMember(groupId.value).then((res: any) => {
    userList.value = res.data
  })
})
</script>

<style lang="scss" scoped>
.mask {
  position: absolute;
  width: 83%;
  height: 100%;
  background-color: transparent;
  z-index: 9;
}
.layoutGroup {
  position: absolute;
  padding: 20px;
  right: 10px;
  top: 7.5%;
  width: 250px;
  height: 85%;
  background-color: #282b38;
  .allUsers {
    display: grid;
    grid-template-columns: repeat(4, 50px);
    grid-gap: 7px;
    margin-top: 20px;

    .item {
      text-align: center;
      font-size: 80%;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
