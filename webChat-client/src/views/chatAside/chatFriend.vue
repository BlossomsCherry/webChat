<template>
  <div class="chatFriend">
    <div class="header mb-10">
      <div class="notification" style="margin-bottom: 10px">通知</div>

      <button class="button mb-4 mt-4">
        <svg class="bell" viewBox="0 0 448 512">
          <path
            d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"
          ></path>
        </svg>
        好友通知
        <div class="arrow">›</div>
      </button>

      <button class="button w-full mb-8">
        <svg class="bell" viewBox="0 0 448 512">
          <path
            d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"
          ></path>
        </svg>
        群通知
        <div class="arrow">›</div>
      </button>
    </div>

    <div class="tabs">
      <div class="w-full max-w-md px-2 sm:px-0">
        <TabGroup>
          <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              v-for="category in Object.keys(categories)"
              as="template"
              :key="category"
              v-slot="{ selected }"
            >
              <button
                :class="[
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                ]"
              >
                {{ category }}
              </button>
            </Tab>
          </TabList>

          <TabPanels class="mt-2">
            <TabPanel
              v-for="(posts, idx) in Object.values(categories)"
              :key="idx"
              :class="[
                'custom-scrollbar',
                'rounded-xl  bg-white p-3 overflow-y-auto h-[3700px]',
                posts.length > 0 ? 'block' : 'hidden'
              ]"
            >
              <ul>
                <li
                  v-for="(item, index) in posts"
                  :key="item.userName"
                  :class="[
                    'relative flex px-4 py-2 cursor-pointer rounded-md',
                    selectIndex === index ? 'bg-sky-900/75 text-white' : ''
                  ]"
                  @click="selectIndex = index"
                >
                  <div class="avatar pr-3">
                    <el-avatar :src="item.friend_avatar" />
                  </div>
                  <div class="right relative flex-col">
                    <div class="top text-sm">{{ item.friendName }}</div>
                    <div class="bottom flex text-xs">
                      <span style="margin-right: 15px">[</span>
                      <div
                        class="status absolute left-1 bottom-2 w-3 h-3 rounded-full"
                        :style="{ backgroundColor: item.friend_status ? '#23e58a' : '#b9bcc6' }"
                      ></div>
                      <span>{{ item.friend_status ? '在线' : '离线' }}</span>
                      <span>]</span>
                      <span class="tag ml-1">{{ item.tag }}</span>
                    </div>
                  </div>

                  <a href="javascript:;" :class="['absolute inset-0 rounded-md']" />
                </li>
              </ul>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFriendList } from '@/api'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

const selectIndex = ref(0)
const categories = ref({
  Friend: [],
  Group: []
})

onMounted(() => {
  const userId = localStorage.getItem('userId')

  getFriendList(Number(userId)).then((res: any) => {
    categories.value.Friend = res.data
  })
})

const currentIndex = ref(Number(localStorage.getItem('friendIndex')) || -1)
const selectFriend = (index: number) => {
  localStorage.setItem('friendIndex', index.toString())
  currentIndex.value = index
}
</script>
-
<style lang="scss" scoped>
.chatFriend {
  height: 100%;
  // background-color: #313746;
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    border-bottom: 1px solid #67eaca;

    .notification {
      width: 90%;
      line-height: 2;
      color: #000;
      text-align: center;
      border-radius: 5px;
      border: 1px solid #f5f5f5;
      background-color: #f5f5f5;
    }

    .button {
      height: 40px;
      width: 90%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      padding: 0px 15px;
      background-color: rgba(66, 66, 66, 0.2);
      border-radius: 10px;
      color: white;
      border: none;
      position: relative;
      cursor: pointer;
      transition-duration: 0.2s;

      .bell {
        width: 13px;
      }

      .bell path {
        fill: rgb(0, 206, 62);
      }

      .arrow {
        position: absolute;
        right: 0;
        width: 30px;
        height: 100%;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &:hover {
        background-color: rgb(77, 77, 77);
        transition-duration: 0.2s;
      }

      &:hover .arrow {
        animation: slide-right 0.6s ease-out both;
      }

      &:active {
        transform: translate(1px, 1px);
        transition-duration: 0.2s;
      }
    }

    /* arrow animation */
    @keyframes slide-right {
      0% {
        transform: translateX(-10px);
        opacity: 0;
      }

      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .item {
      padding: 10px 0;
      width: 90%;
      font-size: 14px;
      color: #fff;
    }
  }

  .custom-scrollbar {
    padding-bottom: 50px;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      -moz-border-radius: 3px;
      -webkit-border-radius: 3px;
      background-color: #c3c3c3;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &:hover {
      &::-webkit-scrollbar {
        display: block;
      }
    }
  }
}
</style>
