<template>
  <div :class="['chat_message', position]" :style="{ color, backgroundColor }">
    <slot>
      <span>{{ message }}</span>
    </slot>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'chatMessage'
})

defineProps({
  message: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'left'
  },
  color: {
    type: String,
    default: '#fff'
  },
  backgroundColor: {
    type: String,
    default: '#118bfa'
  }
})
</script>

<style lang="scss" scoped>
.chat_message {
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 15px;

  &.left {
    border-bottom-left-radius: 1px;
  }

  &.right {
    border-bottom-right-radius: 1px;
  }
}
</style>
