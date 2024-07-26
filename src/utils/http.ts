import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'
const memberStore = useMemberStore()

const httpAddInterceptor = {
  // 拦截器
  // UniApp.RequestOptions: 为uni.request的参数的类型
  invoke(options: UniApp.RequestOptions) {
    // url拼接
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }

    // 超时默认60s 修改为 10s
    options.timeout = 10 * 1000

    // 添加小程序请求头
    options.header = {
      ...options.header,
      'source-client': 'miniapp', // 接口私有规范
    }

    // 自动添加token
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }

    console.log(options)
  },
}

uni.addInterceptor('request', httpAddInterceptor) // 应用拦截器
uni.addInterceptor('uploadFile', httpAddInterceptor) // 应用拦截器

interface Data<T> {
  code: string
  msg: string
  result: T
}

export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,

      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 正常请求
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 登录失效
          // 登录失效，清除信息
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          // 异常请求
          uni.showToast({
            title: (res.data as Data<T>).msg || '请求错误',
            icon: 'none',
          })
          reject(res)
        }
      },
      fail: (err) => {
        // 网络错误
        uni.showToast({
          title: '网络错误',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}
