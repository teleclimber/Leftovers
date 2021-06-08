<template>
	<!-- div id="nav">
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</!-->
	<!-- router-view/ -->

	<div>
		<header class="sticky top-0 z-50 bg-green-600 text-white">
			Leftovers Header
		</header>
		<main class=relative>
			<UpdateUI></UpdateUI>

			<router-view/>
		</main>
		<footer></footer>
		<RequestErrorOverlay></RequestErrorOverlay>
	</div>
</template>


<script lang="ts">
import { defineComponent, reactive } from "vue";

import UpdateUI from './components/Update.vue';
import RequestErrorOverlay from './components/RequestErrorOverlay.vue'

export default defineComponent({
	name: "App",
	components: {
		UpdateUI,
		RequestErrorOverlay
	},
	// setup() {
	// 	const update = reactive(new Update);
	// 	update.init();
	// 	return {
	// 		update
	// 	}
	// }
});
</script>


