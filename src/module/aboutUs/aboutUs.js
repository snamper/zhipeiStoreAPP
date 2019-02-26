import Vue from 'vue'
import aboutUs from './aboutUs.vue'

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(aboutUs)
}).$mount('#aboutUs')
