
<template>
	<div class="p-4 bg-white">
		<img :src="image_src" class="w-80 h-80" />
		<h2 class="text-lg font-bold">{{item.title}} ({{start_str}}, spoils {{spoil_str}})</h2>
		<p>{{item.description}}</p>
		<p>last updated {{last_str}} by {{user.display_name}}</p>
		<p>Update: <router-link :to="{name:'LeftoverItemUpdate', params:{id:id}}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ">Update</router-link></p>
	</div>
</template>


<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { LeftoverItem } from '../models/leftovers';
import {User, ReactiveUsers} from '../models/users';
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

		const user = ref(new User);

		item.fetch(Number(props.id)).then( () => {
			start_str.value = dayjs(item.start_date).fromNow().replace("ago", "old");
			spoil_str.value = dayjs(item.spoil_date).fromNow();
			last_str.value = dayjs(item.last_update).fromNow();
			image_src.value = "/images/"+item.image;
			user.value = ReactiveUsers.getUser(item.proxy_id);
		});

		return {
			item,
			start_str,
			spoil_str,
			last_str,
			image_src,
			user
		}
	}
});
</script>


