<template>
  <div class="chat-tool">
    <div class="avatar" @click="showUserInfo()">
      <el-avatar src="/img/waoku.jpg" />
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
                <span :class="['iconfont', item]"></span>
              </el-icon>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>

    <div class="userInfo" v-if="userInfo">
      <div class="header">
        <div class="left">
          <el-avatar src="/img/waoku.jpg" size="large" />
        </div>
        <div class="right">
          <div class="userName">澜清</div>
          <div class="emil">2234867838@qq.com</div>
          <div class="status">
            <div class="round"></div>
            <span>在线</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="tag">签名：xxxx</div>
        <div>所在地：xxxx</div>
      </div>
      <div class="footer">
        <div class="logout" @click="logout">退出登录</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'

const { proxy }: any = getCurrentInstance()
const menuRef = ref(null)
const router = useRouter()
const sliderRef = ref<HTMLDivElement | null>(null)
const isCollapse = ref(true)
const iconList = ref(['icon-message-dots', 'icon-users', 'icon-grid', 'icon-github', 'icon-shezhi'])

const menuItemClick = (index: number) => {
  const menuItemHeight = proxy.$refs.menuRef.lastChild.firstElementChild.clientHeight

  if (sliderRef.value) sliderRef.value.style.top = 32 + index * menuItemHeight + 'px'
}

const userInfo = ref(false)
const showUserInfo = () => {
  userInfo.value = !userInfo.value
}

/* 退出登录 */
const logout = () => {
  // removeToken()
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
      top: 32px;
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
