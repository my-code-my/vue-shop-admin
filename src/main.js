import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/global.css'
import './assets/font/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import api from '@/api'
Vue.prototype.$api = api

import axios from 'axios'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

axios.interceptors.request.use(config => {

  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// Vue.filter('dateFormat', function (originVal) {
//   const dt = new Date(originVal)
//
//   const y = (dt.getFullYear()+'').padStart(2,'0')
//   const m = (dt.getMonth()+1 +'').padStart(2,'0')
//   const d = (dt.getDay()+'').padStart(2,'0')
//
//   const hh = (dt.getHours()+'').padStart(2,'0')
//   const mm = (dt.getMinutes()+'').padStart(2,'0')
//   const ss = (dt.getSeconds()+'').padStart(2,'0')
//
//   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// })
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
