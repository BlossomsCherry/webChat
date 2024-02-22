<template>
  <div class="chat-tool">
    <div class="avatar" size="large">
      <el-avatar src="../../../public/img/waoku.jpg" />
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
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue'

const { proxy }: any = getCurrentInstance()
const menuRef = ref(null)
const sliderRef = ref<HTMLDivElement | null>(null)
const isCollapse = ref(true)
const iconList = ref(['icon-message-dots', 'icon-users', 'icon-grid', 'icon-github', 'icon-shezhi'])

const menuItemClick = (index: number) => {
  const menuItemHeight = proxy.$refs.menuRef.lastChild.firstElementChild.clientHeight

  if (sliderRef.value) sliderRef.value.style.top = 32 + index * menuItemHeight + 'px'
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .avatar {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    color: #fff;
    align-items: center;
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
}
</style>
