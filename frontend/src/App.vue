<script setup lang="ts">
import { useResponseGuardStore } from './models/response_guard';
import CurrentUser from './components/CurrentUser.vue';
import UpdateApp from './components/UpdateApp.vue';
import RequestErrorOverlay from './components/RequestErrorOverlay.vue';

const responseGuardStore = useResponseGuardStore();

</script>

<template>
	<div>
		<header class="sticky top-0 z-50 h-16 text-white flex items-center justify-between">
			<div class="pl-6">
				<span class="text-2xl">
					<router-link to="/">Leftovers</router-link>
				</span>
			</div>
			<div class="pr-6">
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
<style scoped>
header {
	background: rgb(5, 150, 105);
}
</style>
