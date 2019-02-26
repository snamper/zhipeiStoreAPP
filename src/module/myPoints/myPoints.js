import Vue from 'vue'
import myPoints from './myPoints.vue'

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(myPoints)
}).$mount('#myPoints')
