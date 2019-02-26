import Vue from 'vue'
import infoFinish from './infoFinish.vue'
// import infoFinish from './infoFinish20180424.vue'

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(infoFinish)
}).$mount('#infoFinish')
