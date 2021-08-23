<template>
	<div v-if="update_exists" class="p-2 bg-red-50 text-red-900 italic flex justify-between">
		Refresh to use latest version
		<button @click="SWReg.refreshApp()" class="bg-blue-600 px-4 py-2 rounded text-white">Refresh</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SWReg from '../sw_registration';

export default defineComponent({
	name: "UpdateUI",
	components: {
		
	},
	setup() {
		return {
			SWReg,
			update_exists: SWReg.update_exists	// SWReg is not reactive, so pass the update exists Ref so it is reactive in template.
		}
	}
});
</script>


