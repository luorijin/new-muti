import Vue from 'vue'
import App from './App'
import router from './router'
import ajax from '@/utils/ajax'
// import '@/utils/mock'
Vue.prototype.$http = ajax;
Vue.config.productionTip = false
router.beforeEach((to, from, next)=>{
  to.meta.prev= from;
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})