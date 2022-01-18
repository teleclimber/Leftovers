import app from './app.ts';
import { DB } from "https://deno.land/x/sqlite@v3.1.3/mod.ts";

const dbFilename = "leftovers.db";
let db :DB|undefined;

export default function getDB() :DB {
	if( db === undefined ) {
		const start = Date.now();
		db = new DB(app.appspacePath(dbFilename), {mode:"write"});
		console.log(`getDB: ${Date.now() - start}`);
	}
	return db;
}

export function getCreateDB() :DB {
	if( db === undefined ) db = new DB(app.appspacePath(dbFilename), {mode:"create"});
	return db;
}

export function getDBFile() :string {
	return app.appspacePath(dbFilename);
}