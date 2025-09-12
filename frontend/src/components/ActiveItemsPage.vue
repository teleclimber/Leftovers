<script setup lang="ts">
import { computed } from 'vue';
import {useLeftoverItemsStore} from '../models/leftovers';

import LeftoverListItem from './LeftoverListItem.vue';
import Loading from './Loading.vue';

const leftoverItemsStore = useLeftoverItemsStore();
leftoverItemsStore.fetchActive();	// TODO initial fetch. maybe this should go in main or something?

const fridge_items = computed( () => {
	return leftoverItemsStore.items.filter( item => !item.freezer );
});
const freezer_items = computed( () => {
	return leftoverItemsStore.items.filter( item => item.freezer );
});
</script>

<template>
	<div class="overflow-hidden">
		<div v-if="!leftoverItemsStore.loaded" class="h-64 flex flex-col items-center justify-center">
			<div class="h-4 w-8">
				<Loading class="gray "></Loading>
			</div>
			<p class="mt-4 text-gray-500 italic">Loading...</p>
		</div>
		<p v-else-if="fridge_items.length === 0" class="h-64 flex items-center justify-center italic text-gray-500">
			Nothing in the fridge.
		</p>
		<div v-else class="grid grid-cols-3">
			<LeftoverListItem v-for="item in fridge_items" :item="item" :key="item.id"></LeftoverListItem>
		</div>

		<section class="freezer">
			<h2 class="py-2 px-2 freezer-label ">In the Freezer:</h2>

			<p v-if="freezer_items.length === 0" class="h-64 flex items-center justify-center italic text-gray-500">
				Nothing in the freezer.
			</p>
			<div v-else class="grid grid-cols-3">
				<LeftoverListItem v-for="item in freezer_items" :item="item" :key="item.id"></LeftoverListItem>
			</div>
		</section>

		<div class="col-span-3 h-24">&nbsp;</div>

		<router-link to="New" class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full fixed bottom-6 right-6">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
		</router-link>
	</div>
</template>

<style scoped>
section.freezer {
	background: #7cd8fc;
	background: radial-gradient(circle at top left, rgb(170, 231, 255) 0%, rgba(175, 218, 255, 0.3) 40%, rgba(148, 214, 247, 0) 75%);
	position: relative;
	min-height: 100vw;
	margin-top: 3rem;
}
section.freezer::after {
	content: '❄️';
	font-size: 6rem;
	position: absolute;
	top: -3.5rem;
	right: -1rem;
	opacity: 0.6;
}
section.freezer h2 {
	color: #396a7d;
	font-variant-caps: small-caps;
	font-weight:bold;
}
</style>





