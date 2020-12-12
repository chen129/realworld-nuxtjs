import { request } from '@/plugins/request'

// 用户登录
export const login = data => request.post('/api/users/login', data)

// 用户注册
export const register = data => request.post('/api/users', data)
