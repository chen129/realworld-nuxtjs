import request from '@/utils/request'

// 获取公共文章列表
export const getArticles = params => request.get('/api/articles', { params })
