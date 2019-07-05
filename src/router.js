import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Cate from './views/Category.vue'
import Manager from './views/Manager.vue'
import EditProfile from './views/EditProfile.vue'
import { auth } from './firebase'
Vue.use(Router)
const router = new Router({
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
    },
    {
      path: '/RestaurantSupply',
      name: 'RestaurantSupplyAll',
      component: Cate
    },
    {
      path: '/Manager/:state',
      name: 'Manager',
      component: Manager
    },
    {
      path: '/Manager/',
      name: 'ManagerRoot',
      component: Manager
    },
    {
      path: '/EditProfile',
      name: 'EditProfile',
      component: EditProfile,
      meta: { requiresAuth: true }
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
router.beforeEach((to, from, next) => {
  const requiresAuth = to
    .matched
    .some(record => record.meta.requiresAuth)
  console.log(requiresAuth)
  const user = auth
    .currentUser
  console.log(!user)
  if (requiresAuth && !user) {
    next('/signin')
  } else {
    next()
  }
})
export default router
