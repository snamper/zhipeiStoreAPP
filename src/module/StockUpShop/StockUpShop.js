import Vue from 'vue'
import StockUpShop from './StockUpShop.vue'

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
Vue.config.productionTip = false
// Vue.use(MintUI)

/* eslint-disable no-new */
new Vue({
  render: h => h(StockUpShop)
}).$mount('#StockUpShop')
