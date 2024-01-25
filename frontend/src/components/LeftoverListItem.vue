<script setup lang="ts">
import { ref } from 'vue';
import type { LeftoverItem } from '../models/leftovers';
import dayjs from 'dayjs';
import {getSpoilData} from '../utils/dates';

const props = defineProps<{
	item: LeftoverItem
}>();

const item = props.item;
const start_str = dayjs(item.start_date).fromNow().replace("ago", "old");
const spoil = getSpoilData(item.spoil_date);
		
const last_str = dayjs(item.last_update).fromNow();
const image_src = item.image ? "/images/"+item.image : '';
const user = ref();

</script>

<template>
	<router-link :to="{name:'LeftoverItem', params:{id:item.id}}" class="block bg-gray-700 aspect-square">
		<img v-if="image_src" class="object-cover" :src="image_src" />
		<img v-else src="/public/img/icons/maskable_icon_x512.png"  class="saturate-0 opacity-30" />
	</router-link>
	<router-link :to="{name:'LeftoverItem', params:{id:item.id}}" class="block pl-2 col-span-2 bg-white border-b border-gray-200">
		<h2 class="text-lg font-bold">{{item.title}}</h2>
		<div v-if="spoil.spoiled || spoil.warn" class="flex text-sm ">
			<span  class="px-2 py-1 rounded-full " :class="{
				'bg-green-100':spoil.warn, 'text-green-700':spoil.warn,
				'bg-red-600':spoil.spoiled, 'text-red-100':spoil.spoiled,
			}">{{spoil.text}}</span>
			<span class="py-1 px-2 text-gray-600 italic">{{start_str}}</span>
		</div>
		<div v-else>
			<span class="text-sm text-gray-600 ">{{spoil.text}}</span>
		</div>
		<p class="my-2 line-clamp-2">{{item.description}}</p>
	</router-link>
</template>

