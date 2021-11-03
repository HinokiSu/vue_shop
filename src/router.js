import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from './components/Login'
import Home from './components/Home'

Vue.use(VueRouter)

const routes = [
  // 配置主页重定向
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]


const router = new VueRouter({
  routes
})

//  挂载路由导航守卫
/* 
  to 将要访问的路径
  from 从哪个路径跳转过来
  next 是个函数，表示放行， next() 放行， next('/login') 强制跳转
*/
router.beforeEach((to, from, next) => {
  // 用户访问登录页，直接放行
  if(to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，则强制跳转至登录页
  if(!tokenStr) return next('/login')
  // 已有token，则放行
  next()
})


export default router
