import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from './components/Login'
import Home from './components/Home'
import Welcome from './components/Welcome'
import Users from './components/user/Users'
import Rights from './components/power/Rights'
import Roles from './components/power/Roles'
import Cate from './components/goods/Cate'
import Params from './components/goods/Params'
import List from './components/goods/List'
import Add from './components/goods/Add'
import Order from './components/order/Order'
import Report from './components/report/report'
Vue.use(VueRouter)

const routes = [
  // 配置主页重定向
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }

    ],
  },
]

const router = new VueRouter({
  routes,
})

//  挂载路由导航守卫
/* 
  to 将要访问的路径
  from 从哪个路径跳转过来
  next 是个函数，表示放行， next() 放行， next('/login') 强制跳转
*/
router.beforeEach((to, from, next) => {
  // 用户访问登录页，直接放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，则强制跳转至登录页
  if (!tokenStr) return next('/login')
  // 已有token，则放行
  next()
})

export default router
