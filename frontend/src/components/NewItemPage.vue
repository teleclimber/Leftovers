<script setup lang="ts">
import { ref, Ref } from "vue";
import { useRouter } from "vue-router";
import Camera from './Camera.vue';
import { useLeftoverItemsStore } from "../models/leftovers";
import {ImageChangeMode} from '../models/leftovers';
import Loading from "./Loading.vue";

const router = useRouter();

const leftoversStore = useLeftoverItemsStore();

const title = ref("");
const description = ref("");
const days = ref(5);
const image :Ref<Blob|null> = ref(null);

async function imageChanged(ev:any) {
	if( ev.mode === ImageChangeMode.Replace) {
		image.value = ev.data;
	}
	else {
		image.value = null;
	}
}

const saving = ref(false);
async function save() {
	if( !title.value && !image.value ) return;	// not enough data to save
	saving.value = true;
	await leftoversStore.postNewItem(image.value, title.value, description.value, days.value, new Date());
	saving.value = false;
	router.replace({name:"Home"} );
}

</script>

<template>
	<div class="p-4 bg-white">
		<Camera @imageChanged="imageChanged"></Camera>

		<div class="my-4">
			<label for="title" class="block text-sm font-medium text-gray-700">
				Short Description:
			</label>
			<div class="mt-1">
				<input id="title" type="text" v-model="title" class="w-full shadow-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
			</div>
		</div>

		<div class="my-4">
			<label for="description" class="block text-sm font-medium text-gray-700">
				Notes:
			</label>
			<div class="mt-1">
				<textarea v-model="description" id="description" name="description" rows="3" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" placeholder="Was yummy! One portion left..." />
			</div>
		</div>

		<div class="mt-4 mb-6">
			<label for="days" class="block text-sm font-medium text-gray-700">
				Spoils in {{days}} days
			</label>
			<div class="mt-1">
				<input v-model="days" class="w-full" type="range" id="days" name="days" min="1" max="15" step="1" />
			</div>
		</div>

		<div class="flex justify-between">
			<router-link to="/" class="border border-red-400 text-red-400 px-4 py-2 rounded text-sm uppercase">cancel</router-link>
			<button @click="save"
					class="text-white px-4 py-2 text-sm uppercase rounded"
					:class="[saving ? 'bg-gray-400' : 'bg-blue-600']"
					:disabled="saving">
				<Loading v-if="saving" class="w-9"></Loading>
				<template v-else>Save</template>
			</button>
		</div>
	</div>
</template>
