import Vue from 'vue'
import vinSearchResult from './vinSearchResult.vue'
import router from '../../router/vinSearchResult.js'
if(Vue){
  Vue.config.productionTip = false
  new Vue({
    router,
    render: h => h(vinSearchResult)
  }).$mount('#vinSearchResult')
}

