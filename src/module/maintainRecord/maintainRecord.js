import Vue from 'vue'
import maintainRecord from './maintainRecord.vue'

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(maintainRecord)
}).$mount('#maintainRecord')
