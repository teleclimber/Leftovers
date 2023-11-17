<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useUsersStore } from '../models/users';
import type { User } from '../models/common';

const usersStore = useUsersStore();
const user :Ref<User|undefined> = ref();
usersStore.loadGetCurrentUser().then( u => {
	user.value = u;
});

</script>

<template>
	<div class="flex items-center">
		<span class="hidden md:block px-2">{{user?.display_name}}</span>
		<img v-if="user?.avatar" :src="'/avatars/'+user.avatar" class="w-10 h-10 rounded-full border border-white">
		<div v-else class="w-10 h-10 bg-gray-100 rounded-full border border-white">U</div>
	</div>
</template>