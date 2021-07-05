import ax from '../axios';
import dayjs from 'dayjs';

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

	setFromRaw(raw :any) {
		this.id = Number(raw.id);
		this.title = raw.title+'';
		this.description = raw.description+'';
		this.image = raw.image+'';
		this.start_date = new Date(raw.start_date);
		this.spoil_date = new Date(raw.spoil_date);
		this.last_update = new Date(raw.last_update);
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
		this.items.sort((a, b) => dayjs(a.start_date).isBefore(dayjs(b.start_date)) ? -1 : 1);
		this.loaded = true;
	}


}

export async function postNewItem(imageData:Blob|null, title:string, description:string, days_to_spoil:number, start_date:Date) :Promise<number> {
	const formData = new FormData();
	if( imageData !== null ) formData.append('image', imageData);

	const json = JSON.stringify({
		title,
		description,
		days_to_spoil,
		start_date
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

	const r = await resp.json();

	return r.id;
}