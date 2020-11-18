import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from "@/components/power/Rights"
import Roles from "@/components/power/Roles"
import Categories from "@/components/goods/Categories"
import Params from "@/components/goods/Params"
import List from "@/components/goods/List"
import Add from "@/components/goods/childComp/Add"
import Order from "@/components/order/Order"
import Report from "@/components/report/Report"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: Login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(tokenStr) {
    return next()
  }else{
    return next('/login')
  }
})


export default router
