<script setup lang="ts">
import { useResponseGuardStore } from './models/response_guard';
import CurrentUser from './components/CurrentUser.vue';
import UpdateApp from './components/UpdateApp.vue';
import RequestErrorOverlay from './components/RequestErrorOverlay.vue';
import { useLeftoverItemsStore } from './models/leftovers';

const responseGuardStore = useResponseGuardStore();
const leftoverItemsStore = useLeftoverItemsStore();

</script>

<template>
	<div>
		<header class="sticky top-0 z-50 h-16 text-white flex items-center justify-between">
			<div class="pl-6">
				<span class="text-2xl">
					<router-link to="/">Leftovers</router-link>
				</span>
			</div>
			<div class="pr-6 flex items-center">
				<a href="#" @click.stop.prevent="leftoverItemsStore.fetchActive(true)" class="mr-4">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 " :class="[leftoverItemsStore.loading == 0 ? 'refresher' :'spin']">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
					</svg>
				</a>
				<CurrentUser></CurrentUser>
			</div>
		</header>
		<main class="relative">
			<UpdateApp></UpdateApp>

			<router-view/>
		</main>
		<footer></footer>
		<RequestErrorOverlay></RequestErrorOverlay>
		<div v-if="responseGuardStore.unauthorized" class="absolute top-0 left-0 w-full z-20 h-screen bg-gray-500 bg-opacity-50 p-4 flex justify-center items-center">
			<div class="w-full sm:max-w-3xl rounded-md shadow-lg bg-yellow-100 px-4 sm:px-6 py-5">
				<h3 class="text-xl text-yellow-700">Logged Out</h3>
				<p>You may be logged out.</p>
				<p>Log in to your Dropserver account, and click on this appspace there.</p>
				<p>You may then try to reload this page</p>
			</div>
		</div>
	</div>
</template>

<style>
@import "tailwindcss";
</style>

<style scoped>
header {
	background: rgb(5, 150, 105);
}
.refresher {
	animation: spin 0.5s ease-out normal;
}
.spin {
	animation: spin2 0.5s linear infinite;
	
}
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
@keyframes spin2 {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
