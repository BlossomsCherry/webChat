<template>
  <div class="app-container">
    <div class="left">
      <div class="search">
        <el-input :prefix-icon="Search" placeholder="搜索"></el-input>
      </div>
      <div class="friendList">
        <el-checkbox-group v-model="checkList">
          <template v-for="(item, index) in friendList" :key="index">
            <div class="item">
              <el-checkbox :label="item" :value="index"></el-checkbox>
              <!-- <input type="checkbox" class="ui-checkbox" /> -->

              <el-avatar :src="item.friend_avatar"></el-avatar>
              <div class="name">{{ item.friendName }}</div>
            </div>
          </template>
        </el-checkbox-group>
      </div>
    </div>
    <div class="right">
      <h3>创建群聊</h3>
      <div class="list">
        <template v-for="(item, index) in checkList" :key="index">
          <div class="item">
            <div class="left">
              <el-avatar :src="item.friend_avatar"></el-avatar>
              <span style="margin-left: 15px">{{ item.friendName }}</span>
            </div>
            <div class="right"></div>
          </div>
        </template>
      </div>
      <div class="footer">
        <el-button @click="showCreateGroup = false">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'
import { createGroup } from '@/api'
import { ElMessage, ElNotification } from 'element-plus'

const userStore = useUserStore()
const commonStore = useCommonStore()
const { showCreateGroup } = storeToRefs(commonStore)
const { friendList, userId } = storeToRefs(userStore)
const checkList = ref<any>([])

const confirm = () => {
  const groupName = checkList.value
    .map((item: any) => item.friendName)
    .slice(0, 3)
    .join('、')

  if (!checkList.value.length) {
    ElMessage({
      message: '请选择至少一个好友',
      type: 'error'
    })

    return
  }

  const userList = checkList.value.map((item: any) => item.friendId).concat([userId.value])
  createGroup({ userId: userId.value, groupName: groupName, userList: userList }).then(
    (res: any) => {
      if (res.code == 200) {
        showCreateGroup.value = false

        ElNotification({
          message: '群组创建成功',
          type: 'success'
        })
      }
    }
  )
}
</script>

<style lang="scss" scoped>
:deep(.el-checkbox-group) {
  .el-checkbox__label {
    display: none;
  }
}
.app-container {
  position: absolute;
  display: flex;
  width: 500px;
  padding: 20px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 10px;
  .left,
  .right {
    flex: 1;
  }

  .left {
    .search {
      margin-bottom: 20px;
    }
    .friendList {
      height: 450px;
      padding: 10px 0;
      overflow-y: scroll;

      .item {
        position: relative;
        display: flex;
        padding-bottom: 15px;
        align-items: center;
        span {
          margin-left: 15px;
        }
        .name {
          position: absolute;
          left: 55px;
          width: 20px;
          height: 20px;
          margin-left: 15px;
          color: red;
        }

        .round {
          width: 17px;
          height: 17px;
          text-align: center;
          line-height: 17px;
          border: 1px solid #ccc;
          border-radius: 50px;
          cursor: pointer;
          color: #fff;
          font-size: 12px;
        }
        .active_round {
          background-color: #118bfa;
          border: 1px solid #118bfa;
        }
      }

      /* 设置浏览器滚动条样式 */
      &::-webkit-scrollbar {
        width: 6px;
        /* 滚动条宽度 */
      }

      &::-webkit-scrollbar-thumb {
        /* 滚动条拖动部分的颜色 */
        background-color: #dddee0;
        /* 滚动条设置为圆角 */
        -webkit-border-radius: 5px;
      }

      &::-webkit-scrollbar-track {
        background-color: #fff;
        /* 滚动条轨道的颜色 */
      }
    }
  }

  .right {
    h3 {
      text-align: center;
    }
    .list {
      height: 400px;
      margin-top: 30px;
      margin-left: 20px;
      .item {
        display: flex;
        margin-bottom: 10px;
        justify-content: center;
        align-items: center;
        .left {
          display: flex;
          align-items: center;
        }
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
    }
  }
}

/* checkbox settings 👇 */

.ui-checkbox {
  --primary-color: #1677ff;
  --secondary-color: #fff;
  --primary-hover-color: #4096ff;
  /* checkbox */
  --checkbox-diameter: 17px;
  --checkbox-border-radius: 5px;
  --checkbox-border-color: #d9d9d9;
  --checkbox-border-width: 1px;
  --checkbox-border-style: solid;
  /* checkmark */
  --checkmark-size: 1.2;
}

.ui-checkbox,
.ui-checkbox *,
.ui-checkbox *::before,
.ui-checkbox *::after {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.ui-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: var(--checkbox-diameter);
  height: var(--checkbox-diameter);
  border-radius: var(--checkbox-border-radius);
  background: var(--secondary-color);
  border: var(--checkbox-border-width) var(--checkbox-border-style) var(--checkbox-border-color);
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
}

.ui-checkbox::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-box-shadow: 0 0 0 calc(var(--checkbox-diameter) / 2.5) var(--primary-color);
  box-shadow: 0 0 0 calc(var(--checkbox-diameter) / 2.5) var(--primary-color);
  border-radius: inherit;
  opacity: 0;
  -webkit-transition: all 0.5s cubic-bezier(0.12, 0.4, 0.29, 1.46);
  -o-transition: all 0.5s cubic-bezier(0.12, 0.4, 0.29, 1.46);
  transition: all 0.5s cubic-bezier(0.12, 0.4, 0.29, 1.46);
}

.ui-checkbox::before {
  top: 40%;
  left: 50%;
  content: '';
  position: absolute;
  width: 4px;
  height: 7px;
  border-right: 2px solid var(--secondary-color);
  border-bottom: 2px solid var(--secondary-color);
  -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(0);
  -ms-transform: translate(-50%, -50%) rotate(45deg) scale(0);
  transform: translate(-50%, -50%) rotate(45deg) scale(0);
  opacity: 0;
  -webkit-transition:
    all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6),
    opacity 0.1s;
  -o-transition:
    all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6),
    opacity 0.1s;
  transition:
    all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6),
    opacity 0.1s;
}

/* actions */

.ui-checkbox:hover {
  border-color: var(--primary-color);
}

.ui-checkbox:checked {
  background: var(--primary-color);
  border-color: transparent;
}

.ui-checkbox:checked::before {
  opacity: 1;
  -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(var(--checkmark-size));
  -ms-transform: translate(-50%, -50%) rotate(45deg) scale(var(--checkmark-size));
  transform: translate(-50%, -50%) rotate(45deg) scale(var(--checkmark-size));
  -webkit-transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
  -o-transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
  transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
}

.ui-checkbox:active:not(:checked)::after {
  -webkit-transition: none;
  -o-transition: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  transition: none;
  opacity: 1;
}
</style>
