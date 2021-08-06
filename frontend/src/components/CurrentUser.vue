<template>
	<div class="flex items-center">
		<span class="hidden md:block px-2">{{user.display_name}}</span>
		<img v-if="user.avatar" :src="'/avatars/'+user.avatar" class="w-10 h-10 rounded-full border border-white">
		<div v-else class="w-10 h-10 bg-gray-100 rounded-full border border-white">U</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref, reactive } from "vue";
import {ReactiveUsers} from '../models/users';

export default defineComponent({
	name: "NewItemPage",
	components: {
	},
	setup() {
		ReactiveUsers.fetchCurrent();

		return {
			user: ReactiveUsers.current
		}
	}
});
</script>