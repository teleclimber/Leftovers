import { ref, Ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import { LoadState, User } from './common';
import { gFetch } from './response_guard';

function userFromRaw(raw:any) :User {
	return {
		proxy_id: raw.proxyId+'',
		display_name: raw.displayName+'',
		avatar: raw.avatar+''
	};
}

export const useUsersStore = defineStore('users', () => {
	const load_state = ref(LoadState.NotLoaded);
	const is_loaded = computed( () => load_state.value === LoadState.Loaded );

	const users :Map<string,User> = reactive(new Map);

	const current_user_load_state = ref(LoadState.NotLoaded);
	const current_user_proxy_id:Ref<string|undefined> = ref();

	async function loadData() {
		if( load_state.value !== LoadState.NotLoaded ) return;
		load_state.value = LoadState.Loading;
		const resp = await gFetch("/api/users");
		const data = await resp.json();
		if( !Array.isArray(data) ) throw new Error("expected data to be array");
		data.forEach( updateUserFromRaw );
		load_state.value = LoadState.Loaded;
	}

	async function loadCurrentUserData() {
		if( current_user_load_state.value !== LoadState.NotLoaded ) return;
		current_user_load_state.value = LoadState.Loading;
		const resp = await gFetch("/api/current-user");
		const u = updateUserFromRaw(await resp.json());
		current_user_proxy_id.value = u.proxy_id;
		current_user_load_state.value = LoadState.Loaded;
	}
	async function loadGetCurrentUser() :Promise<User>{
		if( current_user_load_state.value === LoadState.NotLoaded ) {
			await loadCurrentUserData();
		}
		return users.get(current_user_proxy_id.value!)!
	}

	function setEmptyUser(proxy_id:string) {
		users.set(proxy_id, {proxy_id, display_name:"", avatar:""});
	}
	function updateUserFromRaw(raw:any) :User {
		const u = userFromRaw(raw);
		if( !users.has(u.proxy_id) ) setEmptyUser(u.proxy_id);
		const ru = users.get(u.proxy_id)!;
		ru.display_name = u.display_name;
		ru.avatar = u.avatar;
		return ru;
	}

	function loadGetUser(proxy_id:string) :User {
		if( !users.has(proxy_id) ) {
			setEmptyUser(proxy_id);
			loadData();
		}
		return users.get(proxy_id)!;
	}

	return { is_loaded, loadData, loadGetUser, loadGetCurrentUser };
});