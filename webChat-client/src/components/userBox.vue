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
      <button>
        <div class="svg-wrapper-1">
          <div class="svg-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                fill="currentColor"
                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
              ></path>
            </svg>
          </div>
        </div>
        <span>Send</span>
      </button>
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
    default: '#e8e8e8'
  }
})

defineEmits(['clickBtn'])
</script>

<style lang="scss" scoped>
.userBox {
  display: flex;
  margin: 5px 0;
  padding: 15px;
  color: #fff;
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

  button {
    font-family: inherit;
    font-size: 16px;
    background: royalblue;
    color: white;
    padding: 0.4em 0.8em;
    padding-left: 0.9em;
    display: flex;
    align-items: center;
    border: none;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
  }

  button span {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
  }

  button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
  }

  button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }

  button:hover svg {
    transform: translateX(1.2em) rotate(45deg) scale(1.1);
  }

  button:hover span {
    transform: translateX(5em);
  }

  button:active {
    transform: scale(0.95);
  }

  @keyframes fly-1 {
    from {
      transform: translateY(0.1em);
    }

    to {
      transform: translateY(-0.1em);
    }
  }
}
</style>
