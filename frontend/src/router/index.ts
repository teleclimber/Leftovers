import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ActiveItemsPage from '../components/ActiveItemsPage.vue';
import NewItemPage from '../components/NewItemPage.vue';
import ItemPage from '../components/ItemPage.vue';
import ItemUpdatePage from '../components/ItemUpdatePage.vue';

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
  },{
    path:'/leftovers/:id/update',
    name:'LeftoverItemUpdate',
    component: ItemUpdatePage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
