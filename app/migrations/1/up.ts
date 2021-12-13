import * as path from "https://deno.land/std@0.106.0/path/mod.ts";
import Metadata from '@dropserver/ds-metadata.ts';
import {getCreateDB} from '../../db.ts';

export default async function() {
	console.log("creating db");
	const db = getCreateDB();

	console.log("creating table");
	db.query(`CREATE TABLE "leftovers" (
			"id" INTEGER PRIMARY KEY ASC,
			"title" TEXT,
			"description" TEXT,
			"start_date" DATETIME,
			"spoil_date" DATETIME,
			"image" TEXT,
			"finished" INTEGER,
			"proxy_id" TEXT
		)`);

	console.log("creating index");
	db.query(`CREATE INDEX active ON leftovers (spoil_date, finished)`);

	db.close();

	// create a dir for the images:
	const images_path = path.join(Metadata.appspace_path, 'images');
	console.log("images path: "+images_path);
	await Deno.mkdir(images_path);
}
