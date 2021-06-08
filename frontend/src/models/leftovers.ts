import ax from '../axios';
import dayjs from 'dayjs';

export class LeftoverItem {
	loaded = false;

	id = 0;	//string? sqlite rowid?
	title = "";
	description = "";
	image_file = "";
	start_date = new Date();
	last_update = new Date();
	days_to_spoil = 0;

	setFromRaw(raw :any) {
		this.id = Number(raw.id);
		this.title = raw.title+'';
		this.description = raw.description+'';
		this.image_file = raw.image_file+'';
		this.start_date = new Date(raw.start_date);
		this.last_update = new Date(raw.last_update);
		this.days_to_spoil = Number(raw.days_to_spoil);

		this.loaded = true;
	}
	// async fetch(appspace_id: number, proxy_id:string) {
	// 	const resp_data = await get('/appspace/'+appspace_id+'/user/'+proxy_id);
	// 	this.setFromRaw(resp_data);
	// }
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