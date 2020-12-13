import { request } from '@/plugins/request'

// 用户登录
export const login = data => request.post('/api/users/login', data)

// 用户注册
export const register = data => request.post('/api/users', data)

// 更新用户资料
export const updateUser = data => request.put('/api/user', data)

// 获取个人主页资料
export const getProfiles = username => request.get(`/api/profiles/${username}`)

// 关注用户
export const followUser = username => request.post(`/api/profiles/${username}/follow`)

// 取消关注
export const unfollowUser = username => request.delete(`/api/profiles/${username}/follow`)
