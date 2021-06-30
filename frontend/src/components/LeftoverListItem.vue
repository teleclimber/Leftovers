
<template>
	<router-link :to="{name:'LeftoverItem', params:{id:item.id}}" class="block bg-white">
		<img class="object-cover" :src="image_src" />
	</router-link>
	<router-link :to="{name:'LeftoverItem', params:{id:item.id}}" class="block col-span-2 bg-white">
		<h2 class="text-lg font-bold">{{item.title}}</h2>
		 <p>({{start_str}}, spoils {{spoil_str}})</p>
		<p>{{item.description}}</p>
		<p>last updated {{last_str}}</p>
	</router-link>
</template>


<script lang="ts">
import { defineComponent, PropType, reactive } from "vue";
import type { LeftoverItem } from '../models/leftovers';
import dayjs from 'dayjs';

export default defineComponent({
	name: "LeftoverListItem",
	components: {
		
	},
	props: {
		item: {
			type: Object as PropType<LeftoverItem>,
			required: true
		}
	},
	setup(props) {
		const item = props.item;
		const ds = dayjs(item.start_date);
		const start_str = dayjs(item.start_date).fromNow().replace("ago", "old");
		const spoil_str = dayjs(item.spoil_date).fromNow();
		const last_str = dayjs(item.last_update).fromNow();
		const image_src = "/images/"+item.image;
		return {
			image_src,
			start_str,
			spoil_str,
			last_str
		}
	}
});
</script>


