

<template>
	<div v-if="update.update_exists">
		Update Exists
		<button @click="update.refreshApp()">Refresh</button>
	</div>
	<div v-else>
		App is up to date
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


