<template>
  <div>
    <van-address-edit
      :area-list="areaList"
      show-search-result
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      :is-saving="isSaving"
      :is-deleting="isDeleting"
    />
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { areaList } from '@vant/area-data'
import { ref } from 'vue'

const isSaving = ref(false)
const isDeleting = ref(false)

const onSave = () => showToast('save')
const onDelete = () => showToast('delete')
</script>

<style lang="scss" scoped></style>
