import type { BannerItem } from '@/types/home'
import { http } from '@/utils/http'

/**
 * @param distributionSite 1: 首页/2: 商城首页
 */
export const getBannerAPI = (distributionSite = 1) => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
    data: {
      distributionSite: 1,
    },
  })
}
