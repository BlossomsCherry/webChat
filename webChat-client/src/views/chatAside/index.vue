<script lang="ts" setup>
import chatTool from './chatTool.vue'
</script>

<template>
  <div class="chat-aside">
    <div class="tool">
      <chat-tool></chat-tool>
    </div>
    <div class="list">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-aside {
  flex: 1;
  display: flex;
  overflow: hidden;
  background-color: #fff;

  .tool {
    flex: 1;
    background-color: rgba(206, 206, 206, 0.8);
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .list {
    flex: 4;
    box-sizing: border-box;
  }
}
</style>
