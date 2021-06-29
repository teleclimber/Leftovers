import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ActiveItemsPage from '../components/ActiveItemsPage.vue';
import NewItemPage from '../components/NewItemPage.vue';
import ItemPage from '../components/ItemPage.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: ActiveItemsPage
	},{
    path:'/new',
    name:'New',
    component: NewItemPage
  },{
    path:'/leftovers/:id',
    name:'LeftoverItem',
    component: ItemPage,
    props: true
  }

  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
