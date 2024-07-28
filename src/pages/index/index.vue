<script setup lang="ts">
import { getBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import type { XtxGuessInstance } from '@/types/component'

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

const guessRef = ref<XtxGuessInstance>()

const onScrollTolower = () => {}

onLoad(() => {
  getHomeBannerData()
  getHomeCategory()
  getHotPanelData()
})
</script>

<template>
  <CustomNavbar />
  <scroll-view scroll-y class="scroll-view" @scrolltolower="onScrollTolower">
    <XtxSwiper :list="bannerList" />
    <CategoryPanel :list="categoryItemList" />
    <HotPanel :list="hotPanelList" />
    <XtxGuess ref="guessRef" />
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
