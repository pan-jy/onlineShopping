<template>
  <div>
    <van-empty description="购物车还是空的~">
      <van-button
        round
        size="small"
        plain
        type="default"
        class="bottom-button"
        to="/home"
      >
        去逛逛 >
      </van-button>
      <template #image>
        <img src="@/assets/emptyCart.svg" alt="empty-cart" />
      </template>
    </van-empty>

    <Recommend />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.van-empty {
  background-color: #fff;
}
.bottom-button {
  color: #333;
  padding: 0 20px;
}
</style>
