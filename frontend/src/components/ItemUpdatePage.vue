<script setup lang="ts">
import { ref, Ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useLeftoverItemsStore, ImageChangeMode, ItemPatchData, LeftoverItem } from "../models/leftovers";
import dayjs from 'dayjs';
import { getDateAfterDays, getDaysBetween } from '../utils/dates';
import Camera from './Camera.vue';
import FridgeFreezerSelector from './FridgeFreezerSelector.vue';
import SpoilsInInput from './SpoilsInInput.vue';
import Loading from "./Loading.vue";

const props = defineProps<{
	id: number
}>();

const router = useRouter();

const leftoversStore = useLeftoverItemsStore();
	
const title = ref("");
const description = ref("");
const freezer = ref(false);
const start_date = ref("");
const days_to_spoil = ref(5);
const cur_image :Ref<HTMLImageElement|undefined> = ref();
const image_change = ref(ImageChangeMode.Keep);
const replace_image :Ref<Blob|undefined> = ref();

const finished = ref(false);

const show_more = ref(false);

const item :Ref<LeftoverItem|undefined> = ref();
watch( props, async () => {
	const li = await leftoversStore.getLoadItem(props.id);
	if( li === undefined ) {
		alert("unable to find item");
		return;
	}
	item.value = li;

	title.value = item.value.title;
	description.value = item.value.description;
	freezer.value = item.value.freezer;
	start_date.value = dayjs(item.value.start_date).format("YYYY-MM-DD");
	days_to_spoil.value = getDaysBetween(item.value.start_date, item.value.spoil_date);

	// image, needs to be passed to camera
	if( item.value.image ) {
		cur_image.value = new Image();
		cur_image.value.src = "/images/"+item.value.image;
	}
	
	finished.value = item.value.finished;
}, { immediate: true });

async function imageChanged(ev:any) {
	image_change.value = ev.mode;
	if( ev.mode === ImageChangeMode.Replace ) {
		replace_image.value = ev.data;
	}
	else {
		replace_image.value = undefined;
	} 
}

const saving = ref(false);
async function save() {
	if( item.value === undefined ) return;
	const i = item.value;
	const patch_data :ItemPatchData = {
		image_mode: image_change.value
	}
	if( image_change.value === ImageChangeMode.Replace ) patch_data.image_data = replace_image.value;
	if( title.value !== i.title ) patch_data.title = title.value;
	if( description.value !== i.description ) patch_data.description = description.value;
	if( freezer.value !== i.freezer ) patch_data.freezer = freezer.value; 
	if( finished.value != i.finished ) patch_data.finished = finished.value;

	if( start_date.value && start_date.value !== dayjs(i.start_date).format("YYYY-MM-DD") ) {
		patch_data.start_date = dayjs(start_date.value).add(12, 'hour').toDate();
		patch_data.spoil_date = getDateAfterDays( patch_data.start_date, days_to_spoil.value );
	}
	else if( days_to_spoil.value !== getDaysBetween(i.start_date, i.spoil_date) ) {
		patch_data.spoil_date = getDateAfterDays(i.start_date, days_to_spoil.value );
	}

	saving.value = true;
	await leftoversStore.patchItem(props.id, patch_data);
	saving.value = false;
	router.replace({name:"Home"} );
}

</script>

<template>
	<div class="p-4 bg-white">
		<Camera @imageChanged="imageChanged" :image="cur_image" :edit="true"></Camera>
	
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

		<div v-if="!show_more" class="my-4 flex justify-center">
			<label class="bg-yellow-300 py-3 px-6 rounded-full text-yellow-900">
				<input v-model="finished" type="checkbox" id="finished" name="finished" />
				<span class="text-lg pl-1">Finished</span>
			</label>
		</div>

		<div v-if="!show_more" @click.stop.prevent="show_more = true" class="border-b mt-4 mb-8 text-sm text-gray-500 flex justify-between">
			<span>Edit dates...</span>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
			</svg>
		</div>

		<div v-if="show_more" class="flex justify-center my-4">
			<FridgeFreezerSelector v-model="freezer"></FridgeFreezerSelector>
		</div>
		
		<div v-if="show_more" class="my-4">
			<label for="start_date" class="block text-sm font-medium text-gray-700">
				Start Date:
			</label>
			<div class="mt-1">
				<input v-model="start_date" type="date" id="start_date" name="start_date" class="w-full shadow-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md" />
			</div>
		</div>

		<div v-if="show_more" class="my-4">
			<label for="spoils-in-input" class="block text-sm font-medium text-gray-700">
				Spoils
				{{ freezer ? Math.round(days_to_spoil/30) + ' months': days_to_spoil + ' days' }}
				after start day
			</label>
			<div class="mt-1">
				<SpoilsInInput v-model="days_to_spoil" :freezer="freezer"></SpoilsInInput>
			</div>
		</div>

		<div v-if="show_more" @click.stop.prevent="show_more = false" class="border-b mt-4 mb-8 text-sm text-gray-500 flex justify-between">
			<span>Hide dates</span>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
			</svg>
		</div>

		<div class="flex justify-between">
			<router-link :to="{name:'LeftoverItem', params:{id:id}}" class="border border-red-400 text-red-400 px-4 py-2 rounded text-sm uppercase">cancel</router-link>
			<button @click="save" 
					class=" text-white px-4 py-2 text-sm uppercase rounded" 
					:class="[saving ? 'bg-gray-400' : 'bg-blue-600']"
					:disabled="saving">
				<Loading v-if="saving" class="w-9"></Loading>
				<template v-else>Save</template>
			</button>
		</div>
	</div>
</template>
