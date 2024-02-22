<template>
  <div class="chat-login">
    <div class="container-app">
      <!-- 登录 -->
      <div class="login">
        <el-form
          :inline="true"
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          class="demo-form-inline"
        >
          <el-form-item prop="userName">
            <el-input required v-model="ruleForm.userName" placeholder="用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input required v-model="ruleForm.password" type="password" placeholder="密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="loginSubmit(ruleFormRef)"
              >登录</el-button
            >
            <span class="span1" ref="Span1Ref" style="cursor: pointer" @click="registerClick"
              >没有帐号？去注册</span
            >
          </el-form-item>
        </el-form>
      </div>

      <!-- 注册 -->
      <div class="register">
        <el-form
          :inline="true"
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          class="demo-form-inline"
        >
          <el-form-item prop="userName">
            <el-input v-model="ruleForm.userName" placeholder="用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" type="password" placeholder="密码" />
          </el-form-item>
          <el-form-item prop="confirmPsw">
            <el-input v-model="ruleForm.confirmPsw" type="password" placeholder="确认密码" />
          </el-form-item>
          <el-form-item class="footer">
            <el-button type="primary" size="small" @click="registerSubmit">注册</el-button>
            <span class="span2" ref="Span2Ref" style="cursor: pointer" @click="loginClick"
              >已有帐号？去登录</span
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="pre-box" ref="preBoxRef">
        <h1 style="cursor: default">WELCOME</h1>
        <p
          style="margin-bottom: 15px; cursor: default; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2)"
        >
          JOIN US!
        </p>
        <div class="img-box">
          <img class="img" ref="imgRef" :src="imgUrl" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import 'element-plus/theme-chalk/el-notification.css'

import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { login, register } from '@/api'

const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const flag = ref(true)
const Span1Ref = ref(null)
const preBoxRef = ref<HTMLDivElement | null>(null)
const imgUrl = ref('/img/wuwu.jpeg')

const ruleForm = ref<Login>({
  userName: '婉儿',
  password: '520520520',
  confirmPsw: ''
})

const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('用户名不能为空'))
  } else {
    if (ruleForm.value.password !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('userName', () => null)
    }
    callback()
  }
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('密码不能为空'))
  } else {
    if (ruleForm.value.password !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('password', () => null)
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== ruleForm.value.password) {
    callback(new Error('两次输入密码不同！'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<typeof ruleForm>>({
  userName: [{ validator: validateName, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
  confirmPsw: [{ validator: validatePass2, trigger: 'blur' }]
})

/* 重置表单 */
const resetForm = () => {
  ruleForm.value = {
    userName: '',
    password: '',
    confirmPsw: ''
  }
}

/* 登录 */
const loginSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  login(ruleForm.value).then((res: any) => {
    if (res.code === 0) {
      router.push('/layout')

      resetForm()

      ElNotification({
        title: '登录成功',
        message: res.data.userName + '欢迎回来~',
        type: 'success'
      })
    } else {
      ElNotification({
        title: '登录失败',
        message: res.msg,
        type: 'error'
      })
    }
  })
}

/* 注册 */
const registerSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  register(ruleForm.value).then((res: any) => {
    if (res.code === 200) {
      resetForm()

      ElNotification({
        title: '注册成功',
        message: ruleForm.value.userName + '欢迎加入~',
        type: 'success'
      })
    } else {
      ElNotification({
        title: '注册失败',
        message: res.msg,
        type: 'error'
      })
    }
  })
}

const registerClick = () => {
  if (preBoxRef.value) {
    preBoxRef.value.style.right = '50%'
    preBoxRef.value.style.backgroundColor = '#fad5d7'
  }

  flag.value = false
  imgUrl.value = '/img/waoku.jpg'
}

const loginClick = () => {
  if (preBoxRef.value) {
    preBoxRef.value.style.right = '0'
    preBoxRef.value.style.backgroundColor = '#bde0f1'
    imgUrl.value = '/img/wuwu.jpeg'
  }

  flag.value = true
}
</script>

<style lang="less" scoped>
:deep(.el-input__suffix-inner) {
  color: green;
}
.chat-login {
  width: 100%;
  height: 100vh;
  background: linear-gradient(90deg, #fad5d7, #bde0f1);
  .container-app {
    position: absolute;
    display: flex;
    width: 50%;
    min-width: 650px;
    min-height: 375px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    justify-content: center;
    align-items: center;
    border: 1px solid #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
    background: linear-gradient(90deg, #fad5d7, #bde0f1);

    .register,
    .login {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;

      :deep(.el-form) {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
      }

      span {
        padding-bottom: 3px;
        margin-left: 5px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #fff;

        &:hover {
          border-bottom: 1px solid #fff;
        }
      }
    }

    .pre-box {
      display: flex;
      position: absolute;
      width: 50%;
      height: 100%;
      right: 0;
      background-color: #c7dfee;
      color: #fff;
      border-radius: 5px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
      transition: all 0.8s;

      .img-box {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
