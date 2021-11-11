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
// 导入树形表格
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuilllEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入NProgress， 顶部加载条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 关闭生产提示
Vue.config.productionTip = false

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 通过接口获取菜单数据
// 通过axios请求拦截器添加token,保证拥有获取数据的权限
axios.interceptors.request.use((config) => {
  NProgress.start()
  // 为请求头对象，添加Token验证的authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在reponse拦截器中，展示进度条NProgress.done()
axios.interceptors.response.use((config) => {
  NProgress.done()
  return config
})

// 全局使用axios
Vue.prototype.$http = axios

// 全局注册
Vue.component('tree-table', TreeTable)
// 将富文本编辑器，注册为全局可用
Vue.use(VueQuilllEditor)

// 全局过滤器  — 处理时间
Vue.filter('dateFormat', (originVal) => {
  const dt = new Date(originVal)

  // 获取完整年份
  const year = dt.getFullYear()
  // 获取月份， 第一个月为0 所以+1 然后转换成字符串，不足2位在前面补0
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2, '0')
  const hours = (dt.getHours() + '').padStart(2, '0')
  const mintues = (dt.getMinutes() + '').padStart(2, '0')
  const seconds = (dt.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${mintues}:${seconds}`
})

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
