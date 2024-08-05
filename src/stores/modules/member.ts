import type { AddressItem } from '@/types/address'
import type { LoginResult } from '@/types/member'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const profile = ref<LoginResult>()

    // 保存会员信息，登录时使用
    const setProfile = (val: LoginResult) => {
      profile.value = val
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }

    // 收货地址
    const location = ref<AddressItem>()

    // 保存地址信息
    const setLocation = (val: AddressItem) => {
      location.value = val
    }

    // 清理地址信息
    const clearLocation = () => {
      location.value = undefined
    }

    // 记得 return
    return {
      profile,
      setProfile,
      clearProfile,
      location,
      setLocation,
      clearLocation,
    }
  },
  // TODO: 持久化
  {
    // persist: true,
    // 网页端仅需为 true
    // 小程序端需要使用uni兼容
    persist: {
      storage: {
        getItem: (key) => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value),
        // removeItem: (key) => uni.removeStorageSync(key),
        // clear: () => uni.clearStorageSync(),        length: () => uni.getStorageInfoSync().keys.length,
      },
    },
  },
)
