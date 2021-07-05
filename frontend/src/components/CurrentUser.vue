<template>
	<div class="flex items-center">
		<span class="hidden md:block px-2">{{user.display_name}}</span>
		<div class="w-10 h-10 bg-gray-100 rounded-full border border-white">U</div>
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