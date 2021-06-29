
<template>
	<router-link :to="{name:'LeftoverItem', params:{id:item.id}}" class="block p-4 bg-white">
		<h2 class="text-lg font-bold">{{item.title}} ({{start_str}}, spoils {{spoil_str}})</h2>
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
		return {
			start_str,
			spoil_str,
			last_str
		}
	}
});
</script>


