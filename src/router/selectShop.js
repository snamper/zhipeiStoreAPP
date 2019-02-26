import Vue from 'vue'
import Router from 'vue-router'
import vinResultPage from '@/module/selectShop/vinResultPage'
// import chooseCategory from '@/module/selectShop/chooseCategory'
import payment from '@/module/selectShop/payment'
import manufacturerPage from '@/module/selectShop/manufacturerPage'
Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/',
        name: 'selectShop',
        component: vinResultPage
    },
    {
        path: '/vinResultPage',
        name: 'vinResultPage',
        component: vinResultPage
      },
    // {
    //   path: '/chooseCategory',
    //   name: 'chooseCategory',
    //   component: chooseCategory
    // },
    {
      path: '/payment',
      name: 'payment',
      component: payment
    },
    {
      path: '/manufacturerPage',
      name: 'manufacturerPage',
      component: manufacturerPage
    },
  ]
})
