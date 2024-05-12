<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { io, Socket } from 'socket.io-client'

const roomId = '000'

const called = ref<boolean>(false) // 是否是接收方
const caller = ref<boolean>(false) // 是否是发起方
const calling = ref<boolean>(false) // 呼叫中
const communication = ref<boolean>(false) // 通话中
const localVideo = ref<HTMLVideoElement | null>(null) // video标签实例，播放本人的视频
const remoteVideo = ref<HTMLVideoElement | null>(null) // video标签实例，播放对方的视频
const socket = ref<Socket>()
const peer = ref<any>()
const localStream = ref<any>()

onMounted(() => {
  const sock = io('http://localhost:3000', {
    transports: ['websocket'], // 指定传输方式，如WebSocket
    autoConnect: true, // 是否自动连接
    reconnection: true, // 是否自动重新连接
    reconnectionAttempts: 3, // 重新连接尝试次数
    reconnectionDelay: 1000 // 重新连接延迟时间（毫秒）
  })

  sock.on('connect', () => {
    console.log('连接成功~')

    // 向服务器发送加入房间事件
    sock.emit('joinRoom', roomId)
  })

  sock.on('callRemote', () => {
    // 不是发起方
    if (!caller.value) {
      called.value = true // 接听方
      calling.value = true

      console.log('收到视频邀请')
    }
  })

  sock.on('acceptCall', async () => {
    if (caller.value) {
      // 用户A收到用户B同意视频请求
      peer.value = new RTCPeerConnection()
      // 添加本地流音视频流
      peer.value.addStream(localStream.value)

      // 通过监听onicecandidate事件获取candidate信息
      peer.value.onicecandidate = (event: any) => {
        if (event.candidate) {
          // 发送candidate信息
          sock.emit('sendCandidate', { candidate: event.candidate, roomId })
        }
      }

      // 监听onaddStream事件来获取对方音视频流
      peer.value.onaddstream = (event: any) => {
        console.log('用户A收到用户B的stream', event)

        calling.value = false
        communication.value = true

        remoteVideo.value!.srcObject = event.stream
        remoteVideo.value?.play()
      }

      // 生成offer
      const offer = await peer.value.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      })

      console.log(offer)

      // 在本地设置offer信息
      await peer.value.setLocalDescription(offer)

      // 发送offer
      sock.emit('sendOffer', { offer, roomId })
    }
  })

  // 收到offer
  sock.on('sendOffer', async offer => {
    // 当前是接收端的时候进行下一步处理
    if (called.value) {
      console.log('收到offer', offer)
      // 创建自己的RTCPeerConnection
      peer.value = new RTCPeerConnection()

      const stream = await getLocalStream()

      // 添加本地流音视频流
      peer.value.addStream(stream)

      // 通过监听onicecandidate事件获取candidate信息
      peer.value.onicecandidate = (event: any) => {
        if (event.candidate) {
          sock.emit('sendCandidate', { candidate: event.candidate, roomId })
        }
      }

      // 监听onaddStream事件来获取对方音视频流
      peer.value.onaddstream = (event: any) => {
        console.log('用户B收到用户A的stream', event)

        calling.value = false
        communication.value = true

        remoteVideo.value!.srcObject = event.stream
        remoteVideo.value?.play()
      }

      // 设置远端描述信息 SDP
      await peer.value.setRemoteDescription(offer)

      // 生成answer
      const answer = await peer.value.createAnswer()
      console.log('用户B生成answer', answer)

      // 在本地设置answer信息
      await peer.value.setLocalDescription(answer)

      // 发送answer
      sock.emit('sendAnswer', { answer, roomId })
    }
  })

  // 收到answer
  sock.on('sendAnswer', async answer => {
    if (caller.value) {
      console.log('用户A收到answer', answer)
      await peer.value.setRemoteDescription(answer)
    }
  })

  // 收到candidate
  sock.on('sendCandidate', candidate => {
    console.log('收到candidate', candidate)
    peer.value.addIceCandidate(candidate)
  })

  // 对方挂断视频
  sock.on('hangup', () => {
    hangupCall()
  })

  socket.value = sock
})

/* 获取本地音视频流 */
const getLocalStream = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  })

  localVideo.value!.srcObject = stream
  localVideo.value!.play()

  localStream.value = stream

  return stream
}

/* 发起发发起视频请求 */
const callRemote = async () => {
  console.log('发起视频')
  // 用户A像用户B发起视频请求
  caller.value = true // 表示当前用户是发起方
  calling.value = true // 表示当前正在呼叫

  await getLocalStream()

  // 通过信令服务器向用户B发起视频请求
  socket.value?.emit('callRemote', roomId)
}

/* 接受视频请求 */
const acceptCall = async () => {
  console.log('同意视频邀请')

  socket.value?.emit('acceptCall', roomId)
  getLocalStream()
}

/* 挂断视频 */
let isHangupFlag = false
const hangupCall = async () => {
  if (isHangupFlag) return

  console.log('视频已挂断')

  if (peer.value) {
    // 使用getSenders方法停止所有轨道（tracks）
    peer.value.getSenders().forEach((sender: any) => {
      if (sender.track) {
        sender.track.stop()
      }
    })

    // 关闭RTCPeerConnection
    peer.value.close()
    peer.value = null
  }

  // 停止本地视频流的所有轨道
  if (localStream.value) {
    localStream.value.getTracks().forEach((track: any) => track.stop())
  }

  // 清理video元素资源
  if (localVideo.value) {
    localVideo.value.srcObject = null
  }
  if (remoteVideo.value) {
    remoteVideo.value.srcObject = null
  }

  // 重置所有标志位
  calling.value = false
  called.value = false
  caller.value = false
  communication.value = false

  isHangupFlag = true

  // 通知对方挂断
  socket.value?.emit('hangup', roomId)
}
</script>

<template>
  <div class="app">
    <div
      class="w-80 h-4/5 rounded-2xl absolute left-1/2 -translate-x-1/2 bg-gray-200"
    >
      <video
        ref="localVideo"
        class="w-96 h-full bg-gray-200 mb-4 object-cover"
      ></video>
      <video
        ref="remoteVideo"
        class="w-32 h-48 absolute top-0 right-0 object-cover"
      ></video>

      <span
        v-if="!communication"
        class="absolute left-1/2 -translate-x-1/2 text-white bottom-28"
        >{{ caller ? '等待接听中...' : '收到视频邀请' }}</span
      >
      <span
        v-else
        class="absolute left-1/2 -translate-x-1/2 text-white bottom-28"
      >
        正在通话中</span
      >

      <div
        class="phone flex w-40 justify-center absolute left-1/2 -translate-x-1/2 bottom-10"
      >
        <button
          class="button1 mr-6"
          v-if="called && !communication"
          @click="acceptCall"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            viewBox="0 0 32 32"
            height="32"
            fill="none"
            class="svg-icon"
          >
            <path
              stroke-width="2"
              stroke-linecap="round"
              stroke="#fff"
              fill-rule="evenodd"
              d="m24.8868 19.1288c-1.0274-.1308-2.036-.3815-3.0052-.7467-.7878-.29-1.6724-.1034-2.276.48-.797.8075-2.0493.9936-2.9664.3258-1.4484-1.055-2.7233-2.3295-3.7783-3.7776-.6681-.9168-.4819-2.1691.3255-2.9659.5728-.6019.7584-1.4748.4802-2.2577-.3987-.98875-.6792-2.02109-.8358-3.07557-.2043-1.03534-1.1138-1.7807-2.1694-1.77778h-3.18289c-.60654-.00074-1.18614.25037-1.60035.69334-.40152.44503-.59539 1.03943-.53345 1.63555.344 3.31056 1.47164 6.49166 3.28961 9.27986 1.64878 2.5904 3.84608 4.7872 6.43688 6.4356 2.7927 1.797 5.9636 2.9227 9.2644 3.289h.1778c.5409.0036 1.0626-.2 1.4581-.569.444-.406.6957-.9806.6935-1.5822v-3.1821c.0429-1.0763-.7171-2.0185-1.7782-2.2046z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>

        <button
          class="button"
          @click="hangupCall"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="46"
            viewBox="0 0 46 46"
            height="46"
            fill="none"
            class="svg-icon"
          >
            <path
              stroke-width="2"
              stroke-linecap="round"
              stroke="#fff"
              fill-rule="evenodd"
              d="m14.5037 27.0715c.819-.634 1.7094-1.1699 2.653-1.597.7621-.3521 1.2557-1.1094 1.2699-1.9488-.0073-1.1346.7466-2.1517 1.8673-2.3279 1.7701-.2782 3.5728-.2785 5.3429-.0005 1.1206.1759 1.8744 1.193 1.8669 2.3274.0206.8307.5066 1.5791 1.257 1.9359.981.4173 1.9093.9489 2.7657 1.5838.8765.5876 2.0467.4715 2.791-.2769l2.2507-2.2507c.4294-.4283.6617-1.0157.6414-1.6219-.0308-.5985-.314-1.1559-.7793-1.5337-2.5842-2.0976-5.6309-3.5496-8.888-4.2357-2.9976-.6659-6.1047-.6655-9.1023.0009-3.2453.7041-6.2835 2.1503-8.87655 4.2253l-.12568.1256c-.38501.38-.60996.8929-.62872 1.4334-.02687.6011.20148 1.1854.62847 1.6092l2.25008 2.2501c.7307.7914 1.9343.9202 2.8162.3015z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="absolute flex text-white left-1/2 -translate-x-1/2 bottom-20">
      <div
        class="cursor-pointer bg-sky-300 p-2 px-4 mr-6 rounded-lg"
        @click="callRemote"
      >
        发起视频
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
}
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  border: none;
  background-color: #e8584b;
}

.button:hover {
  background-color: #e52441;
}

.button1 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  border: none;
  background-color: #30c04f;
}

.button1::after {
  background-color: #2bac47;
}
</style>
