<template>
	<div v-if="false" class="p-2 bg-red-50 text-red-900 italic flex justify-between">
		Refresh to use latest version !!!ZZZZAFGAGFAGF
		<button @click="" class="bg-blue-600 px-4 py-2 rounded text-white">Refresh</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

//import SWReg from '../sw_registration';

// This needs to be re-implemented when we have Pinia in the project

export default defineComponent({
	name: "UpdateUI",
	components: {
		
	},
	setup() {
		return {
			//SWReg,
			//update_exists: SWReg.update_exists	// SWReg is not reactive, so pass the update exists Ref so it is reactive in template.
		}
	}
});
</script>


