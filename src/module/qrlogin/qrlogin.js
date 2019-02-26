import Vue from 'vue'
import qrlogin from './qrlogin.vue'

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
Vue.config.productionTip = false
// Vue.use(MintUI)



/* eslint-disable no-new */
new Vue({
  render: h => h(qrlogin)
}).$mount('#qrlogin')
