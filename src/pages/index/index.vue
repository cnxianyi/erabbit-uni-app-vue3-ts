<script setup lang="ts">
import { getBannerAPI, getHomeCategoryAPI } from '@/services/home'
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { BannerItem, CategoryItem } from '@/types/home'

const bannerList = ref<BannerItem[]>([])
const categoryItemList = ref<CategoryItem[]>([])

const getHomeBannerData = async () => {
  const res = await getBannerAPI()
  bannerList.value = res.result
}

const getHomeCategory = async () => {
  const res = await getHomeCategoryAPI()
  categoryItemList.value = res.result
}

onLoad(() => {
  getHomeBannerData()
  getHomeCategory()
})
</script>

<template>
  <view>
    <CustomNavbar />
    <XtxSwiper :list="bannerList" />
    <CategoryPanel :list="categoryItemList" />
  </view>
</template>

<style lang="scss">
//
page {
  background-color: #f7f7f7;
}
</style>
