<template>
  <div class="login">
    <Vue3Lottie
      v-show="!isPasswordFocus"
      class="login-avatar"
      :animationData="animationAvatar"
      direction="alternate"
      ref="lottie"
      @on-animation-loaded="lottie.playSegments([60, 300], true)"
    />
    <Vue3Lottie
      v-show="isPasswordFocus"
      class="login-hide"
      direction="alternate"
      ref="lottieHide"
      :animationData="animationHide"
    />
    <van-form class="form" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          clearable
          clickable
          @focus="otherFocus"
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
          @focus="otherFocus"
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
          @focus="passwordFocus"
          @blur="otherFocus"
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
          @focus="passwordFocus"
          @blur="otherFocus"
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
import animationAvatar from '@/assets/animationAvatar.json'
import animationHide from '@/assets/animationHide.json'
import { Vue3Lottie } from 'vue3-lottie'
import { onUnmounted, reactive, ref } from 'vue'
import { register, login } from '@/request/apis/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const lottie = ref()
const lottieHide = ref()
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
      form.username = ''
      form.password = ''
      // console.log('🚀 ~ file: Login.vue:53 ~ onSubmit ~ token:', token)
    } else {
      await register(form.username, form.phone, form.password)
      confirmPassword.value = ''
      isSignIn.value = true
      // console.log('🚀 ~ file: Login.vue:111 ~ onSubmit ~ res:', res)
    }
  } catch (err) {
    console.log('🚀 ~ file: Login.vue:53 ~ onSubmit ~ err:', err)
  }
}

const isPasswordFocus = ref(false)
function otherFocus() {
  isPasswordFocus.value = false
  if (!lottie.value) return
  lottie.value.goToAndPlay(0, true)
  // 使用 requestAnimation 60帧后执行 lottie.value.playSegments([60, 300], true)
  let frameCount = 0
  let requestId = 0

  function checkFrameCount() {
    frameCount++
    if (frameCount >= 60) {
      lottie.value.playSegments([60, 300], true)
      cancelAnimationFrame(requestId)
    } else {
      requestId = requestAnimationFrame(checkFrameCount)
    }
  }
  requestId = requestAnimationFrame(checkFrameCount)
}

function passwordFocus() {
  if (!lottie.value) return
  lottie.value.playSegments([0, 361], true)
  lottie.value.goToAndPlay(300, true)
  let frameCount = 0
  let requestId = 0

  function checkFrameCount() {
    frameCount++
    if (frameCount >= 60) {
      lottie.value.pause()
      lottieHide.value.goToAndPlay(150, true)
      isPasswordFocus.value = true
      cancelAnimationFrame(requestId)
    } else {
      requestId = requestAnimationFrame(checkFrameCount)
    }
  }
  requestId = requestAnimationFrame(checkFrameCount)
}

function changeType() {
  isSignIn.value = !isSignIn.value
}

onUnmounted(() => {
  lottie.value?.destroy()
})
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

  &-hide {
    width: 12rem;
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
