import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

const httpAddInterceptor = {
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
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }

    console.log(options)
  },
}

uni.addInterceptor('request', httpAddInterceptor)
uni.addInterceptor('uploadFile', httpAddInterceptor)
