<script setup lang="ts">
import { ref, Ref } from "vue";
import { useLeftoverItemsStore, LeftoverItem } from '../models/leftovers';
import { useUsersStore } from '../models/users';
import type { User } from '../models/common';
import dayjs from 'dayjs';
import { getSpoilData } from '../utils/dates';
import type {SpoilData} from '../utils/dates';

const props = defineProps<{
	id: number
}>();

const leftoversStore = useLeftoverItemsStore();
const usersStore = useUsersStore();

const start_str = ref("...");
const spoil :Ref<SpoilData> = ref({days:0, text:"", ok:false, warn:false, spoiled:false});
const last_str = ref("...");
const image_src = ref("");

const item :Ref<LeftoverItem|undefined> = ref();
const user :Ref<User|undefined> = ref();

leftoversStore.getLoadItem(props.id).then( li => {
	if( li === undefined ) {
		alert("unable to find item");
		return;
	}
	item.value = li;

	start_str.value = dayjs(li.start_date).fromNow().replace("ago", "old");
	spoil.value = getSpoilData(li.spoil_date, li.freezer);
	last_str.value = dayjs(li.last_update).fromNow();
	image_src.value = '';
	if( li.image ) image_src.value = "/images/"+li.image;
	user.value = usersStore.loadGetUser(li.proxy_id);
});

</script>

<template>
	<div class="p-4 bg-white" :class="[item?.freezer ? 'freezer' : '']">
		<img v-if="image_src" :src="image_src" class="" />
		<h2 class="text-2xl my-4 font-bold">{{item?.title}}</h2>
		<p class="flex">
			<span v-if="item?.freezer" class="px-3 py-1 freezer-label">IN THE FREEZER</span>
		</p>
		<div class="my-4 flex ">
			<span  class="px-3 py-1 rounded-full whitespace-nowrap" :class="{
				'bg-gray-100':spoil.ok, 'text-gray-700':spoil.ok,
				'bg-green-100':spoil.warn, 'text-green-700':spoil.warn,
				'bg-red-600':spoil.spoiled, 'text-red-100':spoil.spoiled,
			}">{{spoil.text}}</span>
			<span class="py-1 px-2 text-gray-600 italic whitespace-nowrap">{{start_str}}</span>
		</div>
		<p v-if="item?.description" class="my-4">{{item?.description}}</p>
		
		<div class="my-4 text-right flex justify-between items-center">
			<p class="text-sm text-gray-600 italic">last updated {{last_str}} by {{user?.display_name}}</p>
			<router-link :to="{name:'LeftoverItemUpdate', params:{id:id}}" class="bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-full ">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
				</svg>
			</router-link>
		</div>
	</div>
</template>

<style scoped>
.freezer-label {
	background: #7cd8fc;
	color: #4d849a;
	background: radial-gradient(circle at top left, rgba(124, 216, 252, 1) 0%, rgba(133, 198, 255, 0.3) 50%, rgba(148, 214, 247, 0) 100%);
	border: 1px solid #7fbfd8;
	position: relative;
	padding-right: 1.5rem;
}
.freezer-label::before {
	content: '❄️';
	font-size: 2rem;
	position: absolute;
	top: -0.9rem;
	right: -1.1rem;
}
</style>