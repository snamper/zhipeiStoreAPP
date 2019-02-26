import Vue from 'vue'
import Router from 'vue-router'
// import offerChoiceShop from '@/module/vinSearchResult/offerChoiceShop'
import index from '@/module/brandChoice/index'
import info from '@/module/brandChoice/info'
if(Router){
  Vue.use(Router)
}


export default new Router({
  routes: [
    {
        path: '/',
        name: 'index',
        component: index
    },
    {
        path: '/index',
        name: 'index',
        component: index
    },
   {
    path: '/info',
    name: 'info',
    component: info
   },

  ]
})