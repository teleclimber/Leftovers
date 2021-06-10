
<template>
	<!-- div id="nav">
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</!-->
	<!-- router-view/ -->

	<div>
		<LeftoverListItem v-for="item in leftovers.items" :item="item" :key="item.id"></LeftoverListItem>
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


