import { defineStore } from 'pinia';
import {ref, reactive} from 'vue';
import { gFetch } from './response_guard';
import dayjs from 'dayjs';

import { getDateAfterDays } from '../utils/dates';

// This was copied from: '../../../app/handlers/leftovers';
type ItemData = {
	title?: string,
	description?: string,
	freezer?: boolean,
	start_date?: Date,
	spoil_date?: Date,
	image_mode: string,
	image?:string,
	finished?:boolean
}

export type ItemPatchData = {
	title?:string,
	description?:string,
	freezer?: boolean,
	start_date?: Date,
	spoil_date?: Date,
	image_mode: ImageChangeMode,
	image_data?:Blob,
	finished?: boolean
}

export type LeftoverItem = {
	id: number,
	title: string,
	description: string,
	freezer: boolean,
	image: string,
	start_date: Date,
	spoil_date: Date,
	last_update: Date,
	finished:boolean,
	proxy_id: string
}

function rawToLeftoverItem(raw:any) :LeftoverItem {
	return {
		id: Number(raw.id),
		title: raw.title+'',
		description: raw.description+'',
		freezer: !!raw.freezer,
		image: raw.image+'',
		start_date: new Date(raw.start_date),
		spoil_date: new Date(raw.spoil_date),
		last_update: new Date(raw.last_update),
		finished: !!raw.finished,
		proxy_id: raw.proxy_id +'',
	}
}

export enum ImageChangeMode {
	Keep = "keep",
	NoImage = "no-image",
	Replace = "replace"
}

export const useLeftoverItemsStore = defineStore('leftover-items', () => {
	const loaded = ref(false);

	const items :LeftoverItem[] = reactive([]);

	async function fetchActive() {
		if( loaded.value ) return;
		const resp = await gFetch('/api/leftovers/');
		const data = <any[]>await resp.json();
		items.splice(0);	// empty items in case of a re-fetch.
		data.forEach( (raw:any) => {
			items.push(rawToLeftoverItem(raw));
		});
		// sort to oldest first
		items.sort(sortItem);
		loaded.value = true;
	}

	async function getLoadItem(id:number) :Promise<LeftoverItem | undefined> {
		await fetchActive();	// TODO assumes active item!
		return items.find( l => l.id === id );
	}

	async function postNewItem(imageData:Blob|null, title:string, description:string, freezer:boolean, days_to_spoil:number, start_date:Date) :Promise<number> {
		const formData = new FormData();
		if( imageData !== null ) formData.append('image', imageData);
	
		const json = JSON.stringify({
			title,
			description,
			freezer,
			start_date,
			spoil_date:getDateAfterDays(start_date, days_to_spoil)
		});
		const json_blob = new Blob([json], {
			type: 'application/json'
		});
	
		formData.append('data', json_blob);

		const resp = await gFetch('/api/leftovers', {
			method: 'POST',
			body: formData
		});

		const r = await resp.json();

		loaded.value = false;
	
		return r.id;
	}

	async function patchItem(id: number, patch:ItemPatchData) {
		const formData = new FormData();
		if( patch.image_data ) {
			formData.append('image', patch.image_data);
			if( patch.image_mode !== ImageChangeMode.Replace ) throw new Error("expected image change mode to be replace, since there is image data.")
		}
	
		const item :ItemData = {image_mode: patch.image_mode};
		Object.assign(item, patch);
	
		const json = JSON.stringify(item);
		const json_blob = new Blob([json], {
			type: 'application/json'
		});
	
		formData.append('data', json_blob);

		await gFetch('/api/leftovers/'+id, {
			method: 'PATCH',
			body: formData
		});

		loaded.value = false;
	}

	return {
		loaded, items, fetchActive,
		getLoadItem,
		postNewItem, patchItem
	}
});

function sortItem(a:LeftoverItem, b:LeftoverItem) {
	return dayjs(a.spoil_date).isBefore(dayjs(b.spoil_date)) ? -1 : 1;
}