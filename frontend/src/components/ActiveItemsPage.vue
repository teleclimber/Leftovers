
<template>
	<div>
		<div v-if="leftovers.items.length === 0" class="h-64 flex items-center justify-center">
			Nothing at the moment.
		</div>
		<div v-else class="grid grid-cols-3">
			<LeftoverListItem v-for="item in leftovers.items" :item="item" :key="item.id"></LeftoverListItem>
		</div>

		<div class="col-span-3 h-24">&nbsp;</div>

		<router-link to="New" class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full fixed bottom-6 right-6">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
		</router-link>
	</div>
</template>


<script lang="ts">
import { defineComponent, reactive } from "vue";
import {LeftoverItems} from '../models/leftovers';

import LeftoverListItem from './LeftoverListItem.vue';

export default defineComponent({
	name: "ActiveItemsPage",
	components: {
		LeftoverListItem
	},
	setup() {
		const leftovers = reactive(new LeftoverItems)
		leftovers.fetchActive();

		return {
			leftovers,
		}
	}
});
</script>


