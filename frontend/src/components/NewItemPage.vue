<template>
	<div class="p-4">
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

		<div class="my-4">
			<label for="days" class="block text-sm font-medium text-gray-700">
				Spoils in {{days}} days
			</label>
			<div class="mt-1">
				<input v-model="days" type="range" id="days" name="days" min="1" max="15" step="1" />
			</div>
		</div>

		<div class="flex justify-between">
			<router-link to="/">Nevermind</router-link>
			<button @click="save">Save</button>
		</div>


	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref } from "vue";
import router from '../router/index';
import Camera from './Camera.vue';
import {postNewItem} from '../models/leftovers';
import {ImageChangeMode} from '../models/leftovers';

export default defineComponent({
	name: "NewItemPage",
	components: {
		Camera
	},
	setup() {
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

		async function save() {
			let new_id :number;
			try {
				new_id = await postNewItem(image.value, title.value, description.value, days.value, new Date());
			}
			catch(e) {
				alert(e);
				return;
			}

			router.push({name:"LeftoverItem",params:{id:new_id}} );
		}

		return {
			title, description, days,
			imageChanged, save
		}
	}

});
</script>