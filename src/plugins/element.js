import Vue from 'vue'
// 按需引入相关组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 全局注册组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 弹窗提示组件， 需要在全局挂载, $message是自定义属性
Vue.prototype.$message = Message
