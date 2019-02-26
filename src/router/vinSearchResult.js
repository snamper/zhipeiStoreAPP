import Vue from 'vue'
import Router from 'vue-router'
// import offerChoiceShop from '@/module/vinSearchResult/offerChoiceShop'
import offerResultShop from '@/module/vinSearchResult/offerResultShop'
import offerInquiryNew from '@/module/vinSearchResult/offerInquiryNew'
if(Router){
  Vue.use(Router)
}


export default new Router({
  routes: [
    {
        path: '/',
        name: 'vinSearchResult',
        component: offerInquiryNew
    },
    {
      path: '/offerInquiryNew',
      name: 'offerInquiryNew',
      component: offerInquiryNew
    },
    {
      path: '/offerResultShop',
      name: 'offerResultShop',
      component: offerResultShop
    },

  ]
})
