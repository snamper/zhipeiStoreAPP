import Vue from 'vue'
import selectShop from './selectShop.vue'
import router from '../../router/selectShop.js'
// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
Vue.config.productionTip = false
// Vue.use(MintUI)
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(selectShop)
}).$mount('#selectShop')
