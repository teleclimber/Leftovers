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
		props: route => {
			let id :number|undefined;
			const qs = Number(route.params['id']);
			if( !isNaN(qs)  ) id = qs;
			return {id}
		}
	},{
		path:'/leftovers/:id/update',
		name:'LeftoverItemUpdate',
		component: ItemUpdatePage,
		props: route => {
			let id :number|undefined;
			const qs = Number(route.params['id']);
			if( !isNaN(qs)  ) id = qs;
			return {id}
		}
	}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router
