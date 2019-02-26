import Vue from 'vue'
import brandChoice from './brandChoice.vue'

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
import router from '../../router/brandChoice.js'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(brandChoice)
}).$mount('#brandChoice')
