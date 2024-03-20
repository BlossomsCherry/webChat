<template>
  <div class="userBox" v-bind="$attrs" :style="{ backgroundColor: backgroundColor }">
    <div class="avatar">
      <el-avatar :src="item?.friend_avatar || item?.avatar" />
    </div>
    <div class="right">
      <div class="top" style="color: #118bfa">
        <div class="name">
          {{ item?.friendName || item?.userName }}
        </div>
        <div class="date">{{ item?.createTime || item?.sendTime }}</div>
      </div>
      <div class="bottom">
        <span>UID：{{ item?.friendId || item?.id }}</span>
        <span class="tag">{{ item?.tag }}</span>
      </div>
    </div>
    <slot>
      <el-button size="small" @click="$emit('clickBtn')">添加</el-button>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  item: {
    type: Object,
    default: () => {
      return {
        userName: '澜清',
        id: 1,
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      }
    }
  },
  backgroundColor: {
    type: String,
    default: '#313746'
  }
})

defineEmits(['clickBtn'])
</script>

<style lang="scss" scoped>
.userBox {
  display: flex;
  margin: 3px 0;
  padding: 15px;
  color: #ffffff;
  border-radius: 5px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &.active {
    background-color: #409eff !important;
  }
  &:hover {
    background-color: #f5f5f5;
  }
  .avatar {
    margin-right: 10px;
  }
  .right {
    flex: 1;
    position: relative;

    .top {
      font-size: 14px;
      .name {
        margin-right: 10px;
      }
    }
    .bottom {
      font-size: 12px;
      line-height: 1.5;
      span {
        color: #515358;
      }
      .status {
        position: absolute;
        left: 6px;
        bottom: 9px;
        width: 11px;
        height: 11px;
        border-radius: 50px;
      }
      .tag {
        margin-left: 5px;
      }
    }
  }
}
</style>
