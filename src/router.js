import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Cate from './views/Category.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/RestaurantSupply/*',
      name: 'RestaurantSupply',
      component: Cate
    }, {
      path: '/RestaurantSupply',
      name: 'RestaurantSupplyAll',
      component: Cate
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
