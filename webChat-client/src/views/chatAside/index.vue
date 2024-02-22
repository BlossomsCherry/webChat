<script lang="ts" setup>
import chatList from './chatList.vue'
import chatTool from './chatTool.vue'
</script>

<template>
  <div class="chat-aside">
    <div class="tool">
      <chat-tool></chat-tool>
    </div>
    <div class="list">
      <chat-list></chat-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-aside {
  flex: 1;
  display: flex;
  overflow: hidden;
  background-color: #282b38;

  .tool {
    flex: 1;
    // margin-left: 1px;
    background-color: #282b38;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .list {
    flex: 3;
    box-sizing: border-box;
  }
}
</style>
