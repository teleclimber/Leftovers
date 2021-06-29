
<template>
	<div class="p-4 bg-white">
		<img :src="image_src" />
		<h2 class="text-lg font-bold">{{item.title}} ({{start_str}}, spoils {{spoil_str}})</h2>
		<p>{{item.description}}</p>
		<p>last updated {{last_str}}</p>
	</div>
</template>


<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { LeftoverItem } from '../models/leftovers';
import dayjs from 'dayjs';

export default defineComponent({
	name: "ItemPage",
	components: {
		
	},
	props: {
		id: {
			type: String,
			required: true
		}
	},
	setup(props) {

		const item = reactive(new LeftoverItem);

		const start_str = ref("...");
		const spoil_str = ref("...");
		const last_str = ref("...");
		const image_src = ref("");

		item.fetch(Number(props.id)).then( () => {
			start_str.value = dayjs(item.start_date).fromNow().replace("ago", "old");
			spoil_str.value = dayjs(item.spoil_date).fromNow();
			last_str.value = dayjs(item.last_update).fromNow();
			image_src.value = "/images/"+item.image;
		});

		return {
			item,
			start_str,
			spoil_str,
			last_str,
			image_src
		}
	}
});
</script>


