import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 通过插件机制获取上下文对象 （query, params, req, res, app, store...）
export default ({ store }) => {
  const { user } = store.state
  request.interceptors.request.use(config => {
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  }, error => {
    return Promise.reject(error)
  })
}
