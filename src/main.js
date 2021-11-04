import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'

// 关闭生产提示
Vue.config.productionTip = false

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 通过接口获取菜单数据
// 通过axios请求拦截器添加token,保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // 为请求头对象，添加Token验证的authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 全局使用axios
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
