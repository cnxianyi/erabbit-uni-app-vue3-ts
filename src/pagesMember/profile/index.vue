<script setup lang="ts">
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

import { getMemberProfileAPI, putMemberProfileAPI } from '@/services/profile'
import { useMemberStore } from '@/stores'
import type { Gender, ProfileDetail } from '@/types/member'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

let profileData = ref({} as ProfileDetail) // 断言提供初始值，保证正常修改

const memberStore = useMemberStore()

const getProfileData = async () => {
  const res = await getMemberProfileAPI()
  profileData.value = res.result
}

onLoad(() => {
  getProfileData()
})

// 修改头像
const onAvatarChange = () => {
  uni.chooseImage({
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: ({ tempFilePaths, tempFiles }) => {
      uni.uploadFile({
        url: '/member/profile/avatar',
        name: 'file', // 后端数据字段名
        filePath: tempFilePaths[0], // 新头像
        success: (res) => {
          // 判断状态码是否上传成功
          if (res.statusCode === 200) {
            // 提取头像
            const { avatar } = JSON.parse(res.data).result
            // 当前页面更新头像
            profileData.value!.avatar = avatar
            // 更新 Store 头像
            memberStore.profile!.avatar = avatar
            uni.showToast({ icon: 'success', title: '更新成功' })
          } else {
            uni.showToast({ icon: 'error', title: '出现错误' })
          }
        },
      })
    },
  })
}

const changeProfile = async () => {
  let location = {
    provinceCode: fullLocationCode[0],
    cityCode: fullLocationCode[1],
    countyCode: fullLocationCode[2],
  }
  let res
  if (fullLocationCode[0]) {
    res = await putMemberProfileAPI({
      nickname: profileData.value.nickname,
      gender: profileData.value.gender,
      birthday: profileData.value.birthday,
      profession: profileData.value.profession,
      ...location,
    })
  } else {
    res = await putMemberProfileAPI({
      nickname: profileData.value.nickname,
      gender: profileData.value.gender,
      birthday: profileData.value.birthday,
      profession: profileData.value.profession,
    })
  }
  profileData.value = res.result
  memberStore.profile!.nickname = profileData.value.nickname
  uni.showToast({
    title: '保存成功',
    icon: 'success',
    mask: true,
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 500)
}

const groupChange: UniHelper.RadioGroupOnChange = (e) => {
  profileData.value.gender = e.detail.value as Gender
}

const birthdayChange: UniHelper.DatePickerOnChange = (e) => {
  profileData.value.birthday = e.detail.value
}

let fullLocationCode: [string, string, string] = ['', '', '']
const locationChange: UniHelper.RegionPickerOnChange = (e) => {
  console.log(e.detail)
  profileData.value.fullLocation = e.detail.value.join(' ')
  fullLocationCode = e.detail.code! // 元组
}
</script>

<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none"></navigator>
      <view class="title">个人信息</view>
    </view>
    <!-- 头像 -->
    <view class="avatar">
      <view class="avatar-content" @tap="onAvatarChange">
        <image class="image" :src="profileData?.avatar" mode="aspectFill" />
        <text class="text">点击修改头像</text>
      </view>
    </view>
    <!-- 表单 -->
    <view class="form">
      <!-- 表单内容 -->
      <view class="form-content">
        <view class="form-item">
          <text class="label">账号</text>
          <text class="account">{{ profileData?.account }}</text>
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input
            class="input"
            type="text"
            placeholder="请填写昵称"
            v-model="profileData!.nickname"
          />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <radio-group @change="groupChange">
            <label class="radio">
              <radio value="男" color="#27ba9b" :checked="profileData?.gender === '男'" />
              男
            </label>
            <label class="radio">
              <radio value="女" color="#27ba9b" :checked="profileData?.gender === '女'" />
              女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">生日</text>
          <picker
            class="picker"
            mode="date"
            :start="profileData?.birthday || '2000-01-01'"
            :end="new Date()"
            value="2000-01-01"
            @change="birthdayChange"
          >
            <view v-if="profileData?.birthday">{{ profileData.birthday }}</view>
            <view class="placeholder" v-else>请选择日期</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <picker
            class="picker"
            @change="locationChange"
            mode="region"
            :value="profileData?.fullLocation?.split(' ')"
          >
            <view v-if="profileData?.fullLocation">{{ profileData?.fullLocation }}</view>
            <view class="placeholder" v-else>请选择城市</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">职业</text>
          <input
            class="input"
            type="text"
            placeholder="请填写职业"
            v-model="profileData!.profession"
          />
        </view>
      </view>
      <!-- 提交按钮 -->
      <button class="form-button" @tap="changeProfile">保 存</button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: auto 420rpx;
  background-repeat: no-repeat;
}

// 导航栏
.navbar {
  position: relative;

  .title {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 0;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 头像
.avatar {
  text-align: center;
  width: 100%;
  height: 260rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff;
  }
}

// 表单
.form {
  background-color: #f4f4f4;

  &-content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  &-item {
    display: flex;
    height: 96rpx;
    line-height: 46rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;

    &:last-child {
      border: none;
    }

    .label {
      width: 180rpx;
      color: #333;
    }

    .account {
      color: #666;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .radio {
      margin-right: 20rpx;
    }

    .picker {
      flex: 1;
    }
    .placeholder {
      color: #808080;
    }
  }

  &-button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #27ba9b;
  }
}
</style>
