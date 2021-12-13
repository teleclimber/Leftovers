import * as path from "https://deno.land/std@0.106.0/path/mod.ts";
import Metadata from '@dropserver/ds-metadata.ts';
import { DB } from "https://deno.land/x/sqlite@v3.1.3/mod.ts";

let db :DB|undefined;

export default function getDB() :DB {
	if( db === undefined ) {
		const start = Date.now();
		db = new DB(dbPath(), {mode:"write"});
		console.log(`getDB: ${Date.now() - start}`);
	}
	return db;
}

export function getCreateDB() :DB {
	if( db === undefined ) db = new DB(dbPath(), {mode:"create"});
	return db;
}

function dbPath() :string {
	return path.join(Metadata.appspace_path,"leftovers.db");
}