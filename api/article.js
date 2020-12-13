import { request } from '@/plugins/request'

// 获取公共文章列表
export const getArticles = params => request.get('/api/articles', {
  params
})

// 获取用户关注文章列表
export const getArticlesFeed = params => request.get('/api/articles/feed', { params })

// 添加点赞
export const addFavorite = slug => request.post(`/api/articles/${slug}/favorite`)

// 取消点赞
export const deleteFavorite = slug => request.delete(`/api/articles/${slug}/favorite`)

// 获取文章详情
export const getArticle = slug => request.get(`/api/articles/${slug}`)

// 获取文章评论
export const getComments = slug => request.get(`/api/articles/${slug}/comments`)

// 新增文章
export const addArticles = data => request.post('/api/articles', data)
