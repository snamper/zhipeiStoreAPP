import Vue from 'vue'
import integralDetails from './integralDetails.vue'

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(integralDetails)
}).$mount('#integralDetails')
