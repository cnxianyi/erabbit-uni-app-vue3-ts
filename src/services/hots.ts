import { http } from '@/utils/http'
import type { PageParams } from '@/types/global'
import type { HotResult } from '@/types/hot'

type hotParams = PageParams & { subType: string } // 交叉类型：在原有类型上添加subType
/**
 *
 * @param url 地址
 * @param data 请求参数
 * @returns http
 */
export const getHotRecommendAPI = (url: string, data?: hotParams) => {
  return http<HotResult>({
    method: 'GET',
    url,
    data,
  })
}
