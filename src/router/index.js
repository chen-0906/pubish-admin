import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index.vue'
import Home from '@/views/home/index.vue'
import Layout from '@/views/layout/index.vue'

Vue.use(VueRouter)
// 路由配置表
const routes = [
  {
    path : '/login',
    name : 'login',
    component : Login
  },
  {
    path: '/',
    // 命名路由有一个默认子路由 这个名字没有意义
    // 正确的做法是 如果有默认子路由， 就不要给父路由器名字
    // name: 'layout',
    component: Layout,
    children : [
      {
        path: '', // path 为空 会作为默认子路由s
        // 路由的名字是 为了在动态路由中 根据路由的名字 进行访问 不比=需要拼接
        name: 'home',
        component: Home
      }
    ]
  },
]


const router = new VueRouter({
  routes
})

export default router
