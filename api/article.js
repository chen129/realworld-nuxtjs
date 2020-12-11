import request from '@/utils/request'

// 获取公共文章列表
export const getArticles = params => request.get('/api/articles', {
  params
})

// 获取用户关注文章列表
export const getArticlesFeed = params => request.get('/api/articles/feed', {
  headers: {
    Authorization: 'Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTI4NDI0LCJ1c2VybmFtZSI6ImNoZW4xMjkiLCJleHAiOjE2MTI4NTMxODJ9.7oBPU8FkJR2iUc2IO__gFgFfM-frUWIzn-wkzbWFaJc'
  },
  params
})
