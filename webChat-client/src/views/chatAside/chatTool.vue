<template>
  <div class="chat-tool">
    <div class="avatar" @click="showUserInfo()">
      <el-avatar :src="user.avatar" />
    </div>
    <div class="tool">
      <div class="menu" ref="menuRef">
        <div class="menu_slider" ref="sliderRef"></div>
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color=" #282b38"
        >
          <template v-for="(item, index) in iconList" :key="index">
            <el-menu-item :index="String(index)" @click="menuItemClick(index)">
              <el-icon>
                <span :class="['iconfont', item.name]"></span>
              </el-icon>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>

    <div class="userInfo" v-if="userInfo">
      <div class="header">
        <div class="left">
          <el-avatar :src="user.avatar" size="large" @click="dialogVisible = true" />
          <el-dialog v-model="dialogVisible">
            <img w-full width="100%" :src="user.avatar" alt="Preview Image" />
          </el-dialog>
        </div>
        <div class="right">
          <div class="userName">{{ user.userName }}</div>
          <div class="emil">2234867838@qq.com</div>
          <div class="status">
            <div class="round"></div>
            <span>在线</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="tag">{{ `签名：${user.tag}` }}</div>
        <div>所在地：xxxx</div>
        <div class="upload_avatar">
          <!-- <form ref="formRef" action="/file/avatar" method="post" enctype="multipart/form-data">
            <input type="file" class="fileInput" name="avatar" accept="image/*" />
            <el-button @click="uploadFile" class="uploadBtn" size="small">上传头像</el-button>
          </form> -->
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :multiple="false"
            :on-change="uploadFile"
          >
            <template #trigger>
              <el-button class="ml-3" type="primary" @click="uploadFile"> 上传头像 </el-button>
            </template>
          </el-upload>
        </div>
      </div>
      <div class="footer">
        <div class="logout" @click="logout">退出登录</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import socket from '@/utils/socket'
import { uploadAvatar, getUserAvatar } from '@/api'
import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

const { proxy }: any = getCurrentInstance()

const dialogVisible = ref(false)
const commonStore = useCommonStore()
const { tabsIndex } = storeToRefs(commonStore)
const menuRef = ref(null)
const router = useRouter()
const sliderRef = ref<HTMLDivElement | null>(null)
const isCollapse = ref(true)
const user: any = computed(() => {
  return JSON.parse(localStorage.getItem('user')!)
})
const iconList = ref([
  { name: 'icon-message-dots', path: '/chat' },
  { name: 'icon-users', path: '/friend' },
  { name: 'icon-grid', path: '' },
  { name: 'icon-github', path: '' },
  { name: 'icon-shezhi', path: '' }
])

onMounted(() => {
  menuItemClick(0)
})

/**
 * 左侧菜单点击
 * @param index
 */
const menuItemClick = (index: number) => {
  tabsIndex.value = index
  const menuItemHeight = proxy.$refs.menuRef.lastChild.firstElementChild.clientHeight

  if (sliderRef.value) sliderRef.value.style.top = 32 + index * menuItemHeight + 'px'

  const path = iconList.value[index].path
  router.push(path)
}

const userInfo = ref(false)
const showUserInfo = () => {
  userInfo.value = !userInfo.value
}

/* 上传头像 */
const imageUrl = ref(user.value.avatar)
const uploadFile = (item: any) => {
  // event.preventDefault()
  let formData = new FormData()
  formData.append('avatar', item.raw)

  // const fileInput: any = formRef.value.querySelector('.fileInput')
  // const file = fileInput.files[0]
  // console.log(file)
  // if (file) {
  //   const formData = new FormData()
  //   formData.append('avatar', file)

  uploadAvatar(formData).then((res: any) => {
    // window.location.reload()
    imageUrl.value = res.data

    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '头像上传成功'
      })

      // 获取头像
      getUserAvatar(11)
    }
  })
  // }
}

/* 退出登录 */
const logout = () => {
  socket.emit('leave', user.value)
  // 断开socket连接
  socket.disconnect()

  localStorage.removeItem('user')
  localStorage.removeItem('currentIndex')
  localStorage.removeItem('userId')
  router.replace('./login')
}
</script>

<style lang="scss" scoped>
:deep(.el-menu) {
  border: none;

  .el-menu-item {
    border-radius: 10px;
  }
  .el-menu-item:hover {
    background-color: #313746;
  }
  .el-icon {
    color: #74798a;
  }
}

.chat-tool {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .avatar {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    color: #fff;
    align-items: center;
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      top: 26px;
      right: 1px;
      width: 9px;
      height: 9px;
      background-color: #23e58a;
      border: 3px solid #282b38;
      border-radius: 50px;
    }
    .el-avatar {
      margin-bottom: 20px;
    }
    .el-icon {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .tool {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    margin-bottom: 20px;
    width: 80%;
    font-size: 20px;
    height: 200px;

    .menu_slider {
      position: absolute;
      // top: 32px;
      top: calc(20%);
      left: 0;
      width: 5px;
      height: 25px;
      border-radius: 20px;
      background-color: #118bfa;
      transition: all 0.3s;
      z-index: 9;
    }
  }

  .userInfo {
    position: absolute;
    padding: 30px 20px;
    left: 58px;
    top: 19px;
    width: 272px;
    // height: 380px;
    color: #fff;
    border-radius: 10px;
    background-color: #313746;
    z-index: 999;
    .header {
      display: flex;
      margin-bottom: 20px;
      align-items: center;

      .left {
        cursor: pointer;
      }
      .right {
        margin-left: 20px;
        .userName {
          font-size: 18px;
        }
        .emil {
          padding: 2px 0;
          font-size: 12px;
        }
        .status {
          display: flex;
          font-size: 14px;
          align-items: center;
          .round {
            margin-right: 5px;
            width: 14px;
            height: 14px;
            border-radius: 50px;
            background-color: #23e58a;
          }
        }
      }
    }
    .content {
      margin: 20px 0;
      font-size: 14px;

      .upload_avatar {
        margin-top: 10px;
        .fileInput {
          // display: none;
          margin-bottom: 10px;
          cursor: pointer;
        }
        .uploadBtn {
          width: 100%;
          padding: 5px;
          background-color: #007bff;
          color: #fff;
          border: none;
          box-shadow: 0px 1px 10px #118bfa;
          cursor: pointer;
        }
      }
      .tag {
        margin-bottom: 10px;
      }
    }
    .footer {
      padding-top: 54px;
      .logout {
        width: 100%;
        line-height: 2;
        // font-weight: 600;
        text-align: center;
        border-radius: 10px;
        background-color: #23e58a;
        cursor: pointer;
      }
    }
  }
}
</style>
