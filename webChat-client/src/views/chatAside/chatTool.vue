<template>
  <div class="chat-tool">
    <div class="avatar">
      <el-avatar @click="showUserInfo()" :src="user.avatar" />
    </div>
    <div class="tool">
      <div class="menu" ref="menuRef">
        <div class="menu_slider" ref="sliderRef"></div>
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color="'rgba(206, 206, 206, 0.9)'"
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

    <div class="userInfo text-gray-500" v-if="userInfo">
      <div class="header">
        <div class="left">
          <el-avatar :src="user.avatar" size="large" @click="dialogVisible = true" />
          <el-dialog v-model="dialogVisible">
            <img w-full width="100%" :src="user.avatar" alt="Preview Image" />
          </el-dialog>
        </div>
        <div class="right">
          <div class="userName text-black">{{ user.userName }}</div>
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
              <button class="cssbuttons-io-button pt-2 pb-2 pl-5 pr-5" @click="uploadFile">
                <svg
                  viewBox="0 0 640 512"
                  fill="white"
                  height="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                  ></path>
                </svg>
                <span class="text-sm">上传头像</span>
              </button>
            </template>
          </el-upload>
        </div>
      </div>
      <div class="footer">
        <button class="Btn" @click="logout">
          <div class="sign">
            <svg viewBox="0 0 512 512">
              <path
                d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
              ></path>
            </svg>
          </div>

          <div class="text">Logout</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import socket from '@/utils/socket'
import { uploadAvatar } from '@/api'
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
  return JSON.parse(sessionStorage.getItem('user')!)
})
const iconList = ref([
  { name: 'icon-message-dots', path: '/chat' },
  { name: 'icon-users', path: '/friend' },
  { name: 'icon-grid', path: '/chatRoom' },
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
  let formData = new FormData()
  formData.append('avatar', item.raw)

  // const fileInput: any = formRef.value.querySelector('.fileInput')
  // const file = fileInput.files[0]
  // console.log(file)
  // if (file) {
  //   const formData = new FormData()
  //   formData.append('avatar', file)

  uploadAvatar(formData).then((res: any) => {
    imageUrl.value = res.data

    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '头像上传成功'
      })
    }
  })
}

/* 退出登录 */
const logout = () => {
  socket.emit('leave', user.value)

  sessionStorage.clear()
  router.replace('./login')

  // 断开socket连接
  socket.disconnect()
}
</script>

<style lang="scss" scoped>
:deep(.el-menu) {
  border: none;

  .el-menu-item {
    border-radius: 10px;
  }
  .el-menu-item:hover {
    background-color: #e0e0e1;
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
      right: -1px;
      width: 10px;
      height: 10px;
      background-color: #23e58a;
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
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.3);
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
          margin-bottom: 10px;
          cursor: pointer;
        }
      }
      .tag {
        margin-bottom: 10px;
      }

      .cssbuttons-io-button {
        display: flex;
        align-items: center;
        font-family: inherit;
        font-weight: 500;
        font-size: 17px;
        color: white;
        background: #ad5389;
        background: linear-gradient(0deg, rgb(120, 47, 255) 0%, rgb(185, 132, 255) 100%);
        border: none;
        letter-spacing: 0.05em;
        border-radius: 20em;

        svg {
          margin-right: 8px;
        }
      }

      .cssbuttons-io-button:hover {
        box-shadow: 0 0.5em 1.5em -0.5em rgb(149, 91, 255);
      }

      .cssbuttons-io-button:active {
        box-shadow: 0 0.3em 1em -0.5em rgb(160, 109, 255);
      }
    }
    .footer {
      padding-top: 29px;

      .Btn {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 45px;
        height: 45px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition-duration: 0.3s;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
        background-color: rgb(255, 65, 65);
      }

      /* plus sign */
      .sign {
        width: 100%;
        transition-duration: 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sign svg {
        width: 17px;
      }

      .sign svg path {
        fill: white;
      }
      /* text */
      .text {
        position: absolute;
        right: 0%;
        width: 0%;
        opacity: 0;
        color: white;
        font-size: 1.2em;
        font-weight: 600;
        transition-duration: 0.3s;
      }
      /* hover effect on button width */
      .Btn:hover {
        width: 100%;
        border-radius: 40px;
        transition-duration: 0.3s;
      }

      .Btn:hover .sign {
        width: 30%;
        transition-duration: 0.3s;
        padding-left: 20px;
      }
      /* hover effect button's text */
      .Btn:hover .text {
        opacity: 1;
        width: 70%;
        transition-duration: 0.3s;
        padding-right: 10px;
      }
      /* button click effect*/
      .Btn:active {
        transform: translate(2px, 2px);
      }
    }
  }
}
</style>
