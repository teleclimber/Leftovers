import * as path from "https://deno.land/std@0.97.0/path/mod.ts";
import Metadata from '@dropserver/ds-metadata.ts';
import {createDatabase} from '@dropserver/appspace-database.ts';

export default async function() {
	console.log("creating db");
	const db = await createDatabase("leftoversdb");

	console.log("creating table");
	await db.exec(`CREATE TABLE "leftovers" (
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
	await db.exec(`CREATE INDEX active ON leftovers (spoil_date, finished)`)

	// create a dir for the images:
	const images_path = path.join(Metadata.appspace_path, 'images');
	console.log("images path: "+images_path);
	await Deno.mkdir(images_path);
}
