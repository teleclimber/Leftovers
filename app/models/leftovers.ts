import Database from '@dropserver/appspace-database.ts';

type insertData = {
	title: string,
	description: string,
	start_date: Date,
	spoil_date: Date,
	image:string
}

export async function insert(data:insertData):Promise<number> {
	const db = new Database('leftoversdb');

	const res = await db.exec('INSERT INTO leftovers ("title", "description", "start_date", "spoil_date", "image") '
		+' VALUES (:title, :description, :start_date, :spoil_date, :image)', data);

	return res.last_insert_id
}