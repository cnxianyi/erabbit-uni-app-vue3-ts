<script setup lang="ts">
import { getBannerAPI } from '@/services/home'
import CustomNavbar from './components/CustomNavbar.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { BannerItem } from '@/types/home'

const bannerList = ref<BannerItem[]>([])

const getHomeBannerData = async () => {
  const res = await getBannerAPI()
  bannerList.value = res.result
}

onLoad(() => {
  getHomeBannerData()
})
</script>

<template>
  <view>
    <CustomNavbar />
    <XtxSwiper :list="bannerList" />
    <view class="index">1index</view>
  </view>
</template>

<style lang="scss">
//
</style>
