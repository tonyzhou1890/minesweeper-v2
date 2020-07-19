import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import localforage from 'localforage'

import './icons' // icon

Vue.config.productionTip = false

// 本地存储
localforage.setDriver(localforage.LOCALSTORAGE);
Vue.prototype.localforage = localforage

// 事件总线
Vue.prototype.bus = new Vue()

new Vue({
  render: h => h(App),
}).$mount('#app')
