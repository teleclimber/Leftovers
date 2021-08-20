<template>
	<!-- div id="nav">
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</!-->
	<!-- router-view/ -->

	<div>
		<header class="sticky top-0 z-50 h-16 bg-green-600 text-white flex items-center justify-between">
			<div class="pl-6">
				<span class="text-2xl">
					<router-link to="/">Leftovers</router-link>
				</span>
			</div>
			<div class="pr-6">
				<CurrentUser></CurrentUser>
			</div>
		</header>
		<main class="relative bg-gray-200">
			<UpdateUI></UpdateUI>

			<router-view/>
		</main>
		<footer></footer>
		<RequestErrorOverlay></RequestErrorOverlay>
	</div>
</template>


<script lang="ts">
import { defineComponent, reactive } from "vue";

import CurrentUser from './components/CurrentUser.vue';
import UpdateUI from './components/Update.vue';
import RequestErrorOverlay from './components/RequestErrorOverlay.vue';

export default defineComponent({
	name: "App",
	components: {
		CurrentUser,
		UpdateUI,
		RequestErrorOverlay
	},
});
</script>


