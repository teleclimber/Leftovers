
<template>
	<div>
		<div class="grid grid-cols-3">
			<LeftoverListItem v-for="item in leftovers.items" :item="item" :key="item.id"></LeftoverListItem>
		</div>
		<div v-if="leftovers.items.length === 0" class="h-64 flex items-center justify-center">
			Nothing at the moment.
		</div>
		<router-link to="New" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full fixed bottom-4 right-4">New</router-link>
	</div>
</template>


<script lang="ts">
import { defineComponent, reactive } from "vue";
import {LeftoverItems} from '../models/leftovers'

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
			leftovers
		}
	}
});
</script>


