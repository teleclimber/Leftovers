import Database from '@dropserver/appspace-database.ts';

export type Leftover = {
	id: number,
	title: string,
	description: string,
	image: string,
	start_date: Date,
	spoil_date : Date,
	last_update: Date,
	finished: boolean,
	proxy_id: string,
}

export async function getByID(id:number) :Promise<Leftover> {
	const db = new Database('leftoversdb');

	const res = await db.query('SELECT * FROM leftovers WHERE id = ?', [id]);
	if( res.rows.length === 0 ) {
		// not found
		throw new Error("id not found: "+id);
	}
	const row = <Leftover>res.rows[0];

	return row;
}

export async function getActive() :Promise<Leftover[]> {
	const db = new Database('leftoversdb');

	const res = await db.query('SELECT * FROM leftovers WHERE finished = 0');

	return <Leftover[]>(res.rows);
}

type insertData = {
	title: string,
	description: string,
	start_date: Date,
	spoil_date: Date,
	image:string,
	finished: boolean,	// obviously false?
	proxy_id: string
}
export async function insert(data:insertData):Promise<number> {
	const db = new Database('leftoversdb');

	const res = await db.exec('INSERT INTO leftovers ("title", "description", "start_date", "spoil_date", "image", "finished", "proxy_id") '
		+' VALUES (:title, :description, :start_date, :spoil_date, :image, :finished, :proxy_id)', data);

	return res.last_insert_id
}

export type UpdateData = {
	title?: string,
	description?: string,
	start_date?: Date,
	spoil_date?: Date,
	image_mode: string,
	image?:string,
	finished?: boolean,
	proxy_id: string
}
const update_keys = ["proxy_id", 'title', 'description', 'finished', 'start_date', 'spoil_date']
export async function update(id:number, data:UpdateData) {
	const db = new Database('leftoversdb');

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

	let q = 'UPDATE leftovers SET '+sets.join(', ')+' WHERE id = :id';

	console.log(q, set_data);

	await db.exec(q, set_data);
}