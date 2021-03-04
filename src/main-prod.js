import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';
Vue.prototype.$http = axios

// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  NProgress.start()
  // 为请求头对象，添加token验证的Authorization字段
  if (JSON.parse(window.sessionStorage.getItem('token')) != null) { config.headers.Authorization = JSON.parse(window.sessionStorage.getItem('token')).token }
  return config
})

// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

// Vue.use(TreeTable)
Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', function (dateStr) {
  var dt = new Date(dateStr * 1000)
  var y = dt.getFullYear()
  var m = (dt.getMonth() + 1).toString().padStart(2, '0')
  var d = dt.getDate().toString().padStart(2, '0')
  var h = dt.getHours().toString().padStart(2, '0')
  var mm = dt.getMinutes().toString().padStart(2, '0')
  var s = dt.getSeconds().toString().padStart(2, '0')
  // return y + "-" + m + "-" + d
  return `${y}-${m}-${d}-${h}-${mm}-${s}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
