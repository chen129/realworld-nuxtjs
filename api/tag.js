import { request } from '@/plugins/request'

// 获取文章标签
export const getTags = params => request.get('/api/tags', { params })
