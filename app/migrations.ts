import {MigrationsBuilder} from 'https://deno.land/x/dropserver_app@v0.2.2/mod.ts';

import app from './app.ts';
import getDB, {getCreateDB, getDBFile} from './db.ts';

export default function createMigrations() {
	const m = new MigrationsBuilder;

	m.upTo(1, async () => {
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

	m.upTo(2, async () => {
		const db = getCreateDB();
		db.query("ALTER TABLE leftovers ADD COLUMN \"freezer\" INTEGER NOT NULL DEFAULT 0");
	});
	m.downFrom(2, async () => {
		const db = getCreateDB();
		db.query("ALTER TABLE leftovers DROP COLUMN \"freezer\"");
	});

	return m.migrations;
}