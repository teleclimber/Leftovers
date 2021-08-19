<template>
	<div class="p-4">
		<Camera @imageChanged="imageChanged" :image="cur_image"></Camera>
	
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

		<div class="my-4 text-lg">
			<label class="">
				<input v-model="finished" type="checkbox" id="finished" name="finished" />
				Finished
			</label>
		</div>

		<!-- maybe put what's below in an expanding section -->

		<!-- div class="my-4">
			<label for="start_date" class="block text-sm font-medium text-gray-700">
				Start Date:
			</label>
			<div class="mt-1">
				<input v-model="start_date" type="date" id="start_date" name="start_date" />
			</div>
		</ -->

		<!--div class="my-4">
			<label for="days" class="block text-sm font-medium text-gray-700">
				Spoils {{days}} days after start day
			</label>
			<div class="mt-1">
				<input v-model="days" type="range" id="days" name="days" min="1" max="15" step="1" />
			</div>
		</div -->

		<div class="flex justify-between">
			<router-link :to="{name:'LeftoverItem', params:{id:id}}">Nevermind</router-link>
			<button @click="save">Save</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref, reactive } from "vue";
import { ItemPatchData, LeftoverItem, ImageChangeMode } from '../models/leftovers';
import router from '../router/index';
import Camera from './Camera.vue';
import {patchItem} from '../models/leftovers';

export default defineComponent({
	name: "ItemUpdatePage",
	components: {
		Camera
	},
	props: {
		id: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const id = Number(props.id);

		const item = reactive(new LeftoverItem);

		const title = ref("");
		const description = ref("");
		const days = ref(5);
		const cur_image :Ref<Image|undefined> = ref();
		const image_change = ref(ImageChangeMode.Keep);
		const replace_image :Ref<Blob|null> = ref(null);

		const finished = ref(false);

		item.fetch(id).then( () => {
			title.value = item.title;
			description.value = item.description;
			// start date?
			// spoil date? How do we deal with that?
			// image, needs to be passed to camera?
			if( item.image ) {
				cur_image.value = new Image();
				cur_image.value.src = "/images/"+item.image;
			}
			
			finished.value = item.finished;
		})

		async function imageChanged(ev:any) {
			image_change.value = ev.mode;
			if( ev.mode === ImageChangeMode.Replace ) {
				replace_image.value = ev.data;
			}
			else {
				replace_image.value = null;
			} 
		}

		async function save() {
			const patch_data :ItemPatchData = {
				image_mode: image_change.value
			}
			if( image_change.value === ImageChangeMode.Replace ) patch_data.image_data = replace_image.value;
			if( title.value !== item.title ) patch_data.title = title.value;
			if( description.value !== item.description ) patch_data.description = description.value;
			if( finished.value != item.finished ) patch_data.finished = finished.value;

			try {
				await patchItem(id, patch_data);
			}
			catch(e) {
				alert(e);
				return;
			}

			if( patch_data.finished ) router.push({name:"Home"} );
			else router.push({name:"LeftoverItem",params:{id}} );
		}

		return {
			title, description, days, cur_image, finished,
			imageChanged, save
		}
	}

});
</script>