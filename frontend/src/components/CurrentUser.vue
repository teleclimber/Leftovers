<script setup lang="ts">
import {ReactiveUsers} from '../models/users';

ReactiveUsers.fetchCurrent();
const user = ReactiveUsers.current;
</script>

<template>
	<div class="flex items-center">
		<span class="hidden md:block px-2">{{user.displayName}}</span>
		<img v-if="user.avatar" :src="'/avatars/'+user.avatar" class="w-10 h-10 rounded-full border border-white">
		<div v-else class="w-10 h-10 bg-gray-100 rounded-full border border-white">U</div>
	</div>
</template>