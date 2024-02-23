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
        <template v-for="(item, index) in friendList" :key="item">
          <div
            :class="['user_item', { active_user_item: index == currentIndex }]"
            @click="selectPerson(index)"
          >
            <div class="avatar">
              <el-avatar :src="item.avatar" />
            </div>
            <div class="content">
              <h5>{{ item.userName }}</h5>
              <span>摸摸哒</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getFriendList } from '@/api'

const search = ref('')
const currentIndex = ref(0)
const searchFlag = ref(true)
const friendList = ref<any>([])

onMounted(() => {
  const userId: string | null = localStorage.getItem('userId')

  getFriendList(userId).then((res: any) => {
    console.log(res)
    friendList.value = res.data
  })
})

const searchFocus = () => {
  searchFlag.value = false
}

const clearClick = () => {
  searchFlag.value = true
}

const selectPerson = (index: number) => {
  currentIndex.value = index
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
        padding-left: 10px;
        flex: 1;

        span {
          font-size: 12px;
        }
      }
    }
    .active_user_item {
      background-color: #118bfa;
      box-shadow: 2px 4px 6px rgba(18, 139, 250, 0.6);
    }
  }
}
</style>
