import * as path from "https://deno.land/std@0.97.0/path/mod.ts";
import type {ServerRequest} from "https://deno.land/std@0.97.0/http/server.ts";
import { MultipartReader, FormFile } from "https://deno.land/std@0.97.0/mime/multipart.ts";
import Metadata from '@dropserver/ds-metadata.ts';
import Users from '@dropserver/appspace-users.ts';

import {dateStr} from './helpers.ts';

type item = {
	id:number,	//string? sqlite rowid?
	title :string,
	description:string,
	image_file:string,
	start_date:Date,
	last_update:Date,
	days_to_spoil:number
}

// temporary dummy data:
const items:item[] = [{
	id:0,
	title:"Veg dinner",
	description:"",
	image_file:"",
	last_update:new Date("June 7, 2021 20:00:00 PDT"),
	start_date:new Date("June 7, 2021 20:00:00 PDT"),
	days_to_spoil: 6
},{
	id:1,
	title:"Chicken Curry",
	description:"one portion left",
	image_file:"",
	last_update:new Date("June 5, 2021 20:00:00 PDT"),
	start_date:new Date("June 5, 2021 20:00:00 PDT"),
	days_to_spoil: 6
}

];

export function getLeftoverItems(req:ServerRequest) {

	req.respond({status:200, body: JSON.stringify(items)});
}

export async function newItemHandler(req:ServerRequest) {
	const form_data = await getUploaded(req);

	console.log(form_data);

	req.respond({status:200});
}

// inspired by https://github.com/deligenius/multiparser
const boundaryRegex = /^multipart\/form-data;\sboundary=(?<boundary>.*)$/;

type RetForm = Record<string, FormFile | FormFile[] | string>;

async function getUploaded(req:ServerRequest) : Promise<RetForm|undefined> {
	const content_type = req.headers.get("content-type");
	if( content_type === null ) return;

	let match = content_type.match(boundaryRegex);
	if (!match) {
    	return
	}
	
	const formBoundary: string = match!.groups!.boundary;
	const reader = new MultipartReader(req.body, formBoundary);
	const formData = await reader.readForm(10 << 20);	// TODO: improve max memory


	const form: RetForm = {};
	for (let [key, value] of formData.entries()) {
		if( Array.isArray(value) ) throw new Error("Did not expect an array. key: "+key);
		if( typeof value === 'string' ) throw new Error("Did not expect an string. key: "+key);
		if( value?.content === undefined ) throw new Error("no file data in content");
		value = <FormFile>value;

		const p = path.join(Metadata.appspace_path, 'images', makeImageFilename());

		await Deno.writeFile(p, value.content!)
	}
	
	return form;
}

function makeImageFilename() :string {
	const a=new Uint16Array(1);
	crypto.getRandomValues(a);
	return dateStr(new Date()) + '-' + a[0].toString(16)+'.jpg';
}

export async function archiveRoute(req:ServerRequest) {
	let display_name = 'Miss Terious';

	const user_id = req.headers.get('user-id');
	if( user_id ) {
		const u = await Users.getUser(user_id);
		display_name = u.display_name;
	}

	req.respond({status:200, body:"<h1>Archive Successful</h1><p>Thank you "+escapeHtml(display_name)+"! <a href=\"/\">Go back</a>"});
}

// https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
function escapeHtml(unsafe:string):string {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }