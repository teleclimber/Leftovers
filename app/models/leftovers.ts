import Database from '@dropserver/appspace-database.ts';

export type Leftover = {
	id: number,
	title: string,
	description: string,
	image: string,
	start_date: Date,
	spoil_date : Date,
	last_update: Date,
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
	finished: boolean,
	proxy_id: string
}
export async function insert(data:insertData):Promise<number> {
	const db = new Database('leftoversdb');

	const res = await db.exec('INSERT INTO leftovers ("title", "description", "start_date", "spoil_date", "image", "finished", "proxy_id") '
		+' VALUES (:title, :description, :start_date, :spoil_date, :image, :finished, :proxy_id)', data);

	return res.last_insert_id
}