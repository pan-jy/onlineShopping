<template>
  <div class="login">
    <Vue3Lottie class="login-avatar" :animationData="animationData" />
    <van-form class="form" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          clearable
          autofocus
          clickable
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-show="!isSignIn"
          v-model="form.phone"
          name="手机号"
          label="手机号"
          type="tel"
          clearable
          clickable
          placeholder="手机号"
          :rules="
            isSignIn
              ? []
              : [
                  { required: true, message: '请填写手机号' },
                  { pattern: telPattern, message: '请输入正确的手机号' }
                ]
          "
        />
        <van-field
          v-model="form.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          clickable
          autocomplete="password"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-show="!isSignIn"
          v-model="confirmPassword"
          type="password"
          name="确认密码"
          label="确认密码"
          placeholder="请确认密码"
          clickable
          autocomplete="password"
          :rules="
            isSignIn
              ? []
              : [
                  { required: true, message: '请确认密码' },
                  {
                    validator: () => form.password === confirmPassword,
                    message: '两次密码不一致'
                  }
                ]
          "
        />
      </van-cell-group>
      <div class="form-btns">
        <van-button
          class="form-btns__first"
          round
          block
          type="primary"
          native-type="submit"
        >
          {{ textMap.get(isSignIn) }}
        </van-button>
        <span class="form-btns__second" @click="changeType">
          去{{ textMap.get(!isSignIn) }} ▷
        </span>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import animationData from '@/assets/animationAvatar.json'
import { Vue3Lottie } from 'vue3-lottie'
import { reactive, ref } from 'vue'
import { register, login } from '@/request/apis/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const isSignIn = ref(true)
const textMap = new Map([
  [true, '登录'],
  [false, '注册']
])

const telPattern = /^1[3456789]\d{9}$/
const form = reactive({
  phone: '',
  password: '',
  username: ''
})
// 确认密码
const confirmPassword = ref('')
async function onSubmit() {
  try {
    if (isSignIn.value) {
      const { token } = await login(form.username, form.password)
      localStorage.setItem('token', token)
      router.replace('/home')
      // console.log('🚀 ~ file: Login.vue:53 ~ onSubmit ~ token:', token)
    } else {
      await register(form.username, form.phone, form.password)
      confirmPassword.value = ''
      isSignIn.value = true
      // console.log('🚀 ~ file: Login.vue:111 ~ onSubmit ~ res:', res)
    }
    form.phone = ''
    form.password = ''
    form.username = ''
  } catch (err) {
    console.log('🚀 ~ file: Login.vue:53 ~ onSubmit ~ err:', err)
  }
}

function changeType() {
  isSignIn.value = !isSignIn.value
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;

  &-avatar {
    width: 15rem;
    height: 15rem;
  }
}

.form {
  width: 90vw;
  &-btns {
    margin: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;

    &__second {
      margin-top: 0.8rem;
      font-size: 15px;
      color: #555;
    }
  }
}
</style>
