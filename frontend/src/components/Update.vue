

<template>
	<div v-if="update.update_exists" class="p-2 bg-red-50">
		Update Exists
		<button @click="update.refreshApp()">Refresh</button>
	</div>
</template>


<script lang="ts">
import { defineComponent, reactive } from "vue";

import Update from '../update';

export default defineComponent({
	name: "UpdateUI",
	components: {
		
	},
	setup() {
		const update = reactive(new Update);
		update.init();
		return {
			update
		}
	}
});
</script>


