/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'

// 创建一个axios 实例
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
// 复制了一个axios 不同的 axios 实例可能有不同的配置 而且没有冲突
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 请求的基础路径

  // 定义后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
  transformResponse: [function (data) {
    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }

    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
})

/**
 * 解决思路：

 Axios 会在内部使用 JSON.parse 把后端返回的数据转为 JavaScript 数据对象。

 所以解决思路就是：不要让 axios 使用 JSON.parse 来转换这个数据，而是使用 json-biginit 来做转换处理。

 axios 提供了一个 API：transformResponse

 还有需要注意的是：不要使用 13911111111 这个账号来测试删除操作。
 为什么？这是后端做了限制，防止你把数据删没了，别人没法测试了，所以使用自己的账户去完整版中添加一些数据然后来到开发版中进行测试。
 */

// 请求拦截器
request.interceptors.request.use(
  // 任何请求都会经过这里
  // config 是当前请求相关的配置信息对象
  // config 是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有登录信息 则统一设置 token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    // 然后我们就可以在允许请求出去之前定制统一业务功能处理
    // 例如：统一的设置 token

    // 当这里 return config 之后请求在会真正的发出去
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 响应拦截器

// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块
// import request from 'request.js'
// request.xxx
// request({
//   method: ,
//   url: ''
// })
