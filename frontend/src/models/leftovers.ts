import ax from '../axios';
import dayjs from 'dayjs';

import { getDateAfterDays } from '../utils/dates';

import type {ItemData} from '../../../app/handlers/leftovers';

export enum ImageChangeMode {
	Keep = "keep",
	NoImage = "no-image",
	Replace = "replace"
}

export class LeftoverItem {
	loaded = false;

	id = 0;	//string? sqlite rowid?
	title = "";
	description = "";
	image = "";
	start_date = new Date();
	spoil_date = new Date();
	last_update = new Date();//unsure how we do this
	proxy_id = "";	// proxy id of user of update [later]
	finished = false;

	setFromRaw(raw :any) {
		this.id = Number(raw.id);
		this.title = raw.title+'';
		this.description = raw.description+'';
		this.image = raw.image+'';
		this.start_date = new Date(raw.start_date);
		this.spoil_date = new Date(raw.spoil_date);
		this.last_update = new Date(raw.last_update);
		this.finished = !!raw.finished;
		this.proxy_id = raw.proxy_id +'';

		this.loaded = true;
	}
	async fetch(leftover_id: number) {
		const resp_data = await ax.get('/api/leftovers/'+leftover_id);
		this.setFromRaw(resp_data.data);
	}
}

export class LeftoverItems {
	loaded = false;

	items :LeftoverItem[] = [];

	async fetchActive() {
		const resp = await ax.get('/api/leftovers/');
		resp.data.forEach( (raw:any) => {
			const leftover = new LeftoverItem;
			leftover.setFromRaw(raw);
			this.items.push(leftover);
		});
		// sort to oldest first
		this.items.sort((a, b) => dayjs(a.spoil_date).isBefore(dayjs(b.spoil_date)) ? -1 : 1);
		this.loaded = true;
	}


}

export async function postNewItem(imageData:Blob|null, title:string, description:string, days_to_spoil:number, start_date:Date) :Promise<number> {
	const formData = new FormData();
	if( imageData !== null ) formData.append('image', imageData);

	const json = JSON.stringify({
		title,
		description,
		start_date,
		spoil_date:getDateAfterDays(start_date, days_to_spoil)
	});
	const json_blob = new Blob([json], {
		type: 'application/json'
	});

	formData.append('data', json_blob);

	let resp:Response|undefined;
	try {
		resp = await fetch('/api/leftovers', {
			method: 'POST',
			body: formData
		})
	} catch(e) {
		console.error(e);
	}

	if( resp === undefined ) {
		throw new Error("response undefined");
	}
	if( !resp.ok ) throw new Error("Post failed: "+resp.statusText);

	const r = await resp.json();

	return r.id;
}

export type ItemPatchData = {
	image_mode: ImageChangeMode,
	image_data?:Blob,
	title?:string,
	description?:string,
	start_date?: Date,
	spoil_date?: Date,
	finished?: boolean
}
export async function patchItem(id: number, patch:ItemPatchData) {
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

	const resp = await fetch('/api/leftovers/'+id, {
		method: 'PATCH',
		body: formData
	});
	if( !resp.ok ) throw new Error("Patch failed: "+resp.statusText);
}