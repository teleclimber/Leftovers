<script setup lang="ts">
import { ref } from 'vue';

//import SWReg from '../sw_registration';

// This needs to be re-implemented when we have Pinia in the project

const update_exists = ref(false);


</script>

<template>
	<div v-if="update_exists" class="p-2 bg-red-50 text-red-900 italic flex justify-between">
		Refresh to use latest version
		<button @click="" class="bg-blue-600 px-4 py-2 rounded text-white">Refresh</button>
	</div>
</template>
