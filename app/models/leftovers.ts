import getDB from '../db.ts';

export type Leftover = {
	id: number,
	title: string,
	description: string,
	freezer: boolean,
	image: string,
	start_date: Date,
	spoil_date : Date,
	last_update: Date,	// actually a hallucinated prop, not in DB.
	finished: boolean,
	proxy_id: string,
}

export function getByID(id:number) :Leftover {
	const res = getDB().queryEntries<Leftover>('SELECT * FROM leftovers WHERE id = ?', [id]);
	if( res.length === 0 ) {
		throw new Error("id not found: "+id);
	}
	return res[0];
}

export function getActive() :Leftover[] {
	return getDB().queryEntries<Leftover>('SELECT * FROM leftovers WHERE finished = 0');
}

type insertData = {
	title: string,
	description: string,
	freezer: boolean,
	start_date: Date,
	spoil_date: Date,
	image:string,
	finished: boolean,
	proxy_id: string
}
export function insert(data:insertData):number {
	const db = getDB();
	const start = Date.now();
	db.query('INSERT INTO leftovers ("title", "description", "freezer", "start_date", "spoil_date", "image", "finished", "proxy_id") '
		+' VALUES (:title, :description, :freezer, :start_date, :spoil_date, :image, :finished, :proxy_id)', data);

	return db.lastInsertRowId;
}

export type UpdateData = {
	title?: string,
	description?: string,
	freezer?: boolean, 
	start_date?: Date,
	spoil_date?: Date,
	image_mode: string,
	image?:string,
	finished?: boolean,
	proxy_id: string
}
const update_keys = ["proxy_id", 'title', 'description', 'freezer', 'finished', 'start_date', 'spoil_date']
export function update(id:number, data:UpdateData) {
	const sets :string[] = [];
	const set_data :Record<string, any> = {'id':id};
	update_keys.forEach( k => {
		if( !data.hasOwnProperty(k) ) return;
		sets.push(`${k} = :${k}`);
		// @ts-ignore 
		set_data[k] = data[k];
	});
	if( data.image_mode === "replace" ) {
		sets.push('image = :image');
		set_data['image'] = data.image;
	} 
	else if( data.image_mode === "no-image" ) {
		sets.push('image = :image');
		set_data['image'] = '';
	}
	
	const start = Date.now();
	getDB().query('UPDATE leftovers SET '+sets.join(', ')+' WHERE id = :id', set_data);
}