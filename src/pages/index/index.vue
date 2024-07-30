<script setup lang="ts">
import { getBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { useGuessList } from '@/composables'

const bannerList = ref<BannerItem[]>([])
const categoryItemList = ref<CategoryItem[]>([])
const hotPanelList = ref<HotItem[]>([])

const getHomeBannerData = async () => {
  const res = await getBannerAPI()
  bannerList.value = res.result
}

const getHomeCategory = async () => {
  const res = await getHomeCategoryAPI()
  categoryItemList.value = res.result
}

const getHotPanelData = async () => {
  const res = await getHomeHotAPI()
  hotPanelList.value = res.result
}

const isLoading = ref(true)

onLoad(() => {
  isLoading.value = true
  Promise.all([getHomeBannerData(), getHomeCategory(), getHotPanelData()])
  isLoading.value = false
})

const { guessRef, onScrollTolower } = useGuessList()

// 下拉刷新
const isTrigger = ref(false)
const onRefresherrefresh = async () => {
  isTrigger.value = true
  guessRef.value?.refreshData(),
    await Promise.all([
      getHomeBannerData(),
      getHomeCategory(),
      getHotPanelData(),
      guessRef.value?.getMore(),
    ])
  isTrigger.value = false
}
</script>

<template>
  <CustomNavbar />
  <scroll-view
    scroll-y
    class="scroll-view"
    @scrolltolower="onScrollTolower"
    refresher-enabled
    @refresherrefresh="onRefresherrefresh"
    :refresher-triggered="isTrigger"
  >
    <Skeleton v-if="isLoading" />
    <template v-else>
      <XtxSwiper :list="bannerList" style="height: 280px" />
      <CategoryPanel :list="categoryItemList" />
      <HotPanel :list="hotPanelList" />
      <XtxGuess ref="guessRef" />
    </template>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
</style>
