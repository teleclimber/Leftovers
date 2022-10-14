import {MigrationsBuilder} from 'https://deno.land/x/dropserver_app@v0.2.0/mod.ts';

import app from './app.ts';
import getDB, {getCreateDB, getDBFile} from './db.ts';

export default function createMigrations() {
	const m = new MigrationsBuilder;

	console.log("leftovers registering migrations");
	m.upTo(1, async () => {
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
		const images_path = app.appspacePath('images');
		console.log("images path: "+images_path);
		await Deno.mkdir(images_path);
	});

	m.downFrom(1, async() => {
		const db = getDB();
		db.close();//just to be sure.

		const filename = getDBFile();
		await Deno.remove(filename);

		await Deno.remove(app.appspacePath('images'), {recursive:true});
	});

	return m.migrations;
}