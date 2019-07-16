import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Cate from './views/Category.vue'
import Manager from './views/Manager.vue'
import EditProfile from './views/EditProfile.vue'
import Cart from './views/Cart.vue'
import { auth } from './firebase'
import Store from './store'
import NProgress from 'nprogress'
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
      component: Manager,
      meta: { requiresAdmin: true, requiresAuth: true }
    },
    {
      path: '/Manager/',
      name: 'ManagerRoot',
      component: Manager,
      meta: { requiresAdmin: true, requiresAuth: true }
    },
    {
      path: '/Profile/:state',
      name: 'Profile',
      component: EditProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/Cart',
      name: 'Cart',
      component: Cart,
      meta: { requiresAuth: true }
    },
    {
      path: '/Profile/',
      name: 'ProfileRoot',
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
router.afterEach(() => {
})
router.beforeEach((to, from, next) => {
  const requiresAuth = to
    .matched
    .some(record => record.meta.requiresAuth)
  const requiresAdmin = to
    .matched
    .some(record => record.meta.requiresAdmin)
  const user = auth
    .currentUser
  const isAdmin = Store.state.userProfile.isAdmin
  if (requiresAuth && !user) {
    Store.commit('openLogin')
    next(from)
  } else if (requiresAdmin && !isAdmin) {
    alert('Sorry,we can\'t access this!')
    next(from)
  }
  else {
    next()
  }
})
export default router
