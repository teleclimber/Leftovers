import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';

type Err = {
	method: string,
	path: string,
	code: number,
	message: string
}

export const useResponseGuardStore = defineStore('response-guard', () => {
	const errors :Ref<Array<Err>> = ref([]);
	const unauthorized = ref(false);
	return {errors, unauthorized};
});


export async function gFetch(input: RequestInfo | URL, init?: RequestInit | undefined) :Promise<Response> {
	let method = "";
	if( init !== undefined && init.method ) method = init.method; 
	//@ts-ignore I don't how to tell TS to chill about this.
	if( typeof input === 'object' && input.method ) method = input.method;

	// maybe wrap fetch call and try to get info about error?
	const resp = await fetch(input, init);
	if( !resp.ok ) {
		const store = useResponseGuardStore();
		if( resp.status === 401 || resp.status === 403 ) {
			store.unauthorized = true;
		}
		else {
			store.errors.push({
				method,
				path:resp.url,
				code: resp.status, 
				message: await resp.text()
			});
		}
	}
	return resp;
}