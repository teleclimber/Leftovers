import * as path from "https://deno.land/std@0.97.0/path/mod.ts";
import type {ServerRequest, Response} from "https://deno.land/std@0.97.0/http/server.ts";
import { MultipartReader, FormFile } from "https://deno.land/std@0.97.0/mime/multipart.ts";
import type { Context} from '@dropserver/app-router.ts';
import Metadata from '@dropserver/ds-metadata.ts';
import Users from '@dropserver/appspace-users.ts';

import {insert, getByID, getActive}  from '../models/leftovers.ts';
import type {Leftover} from '../models/leftovers.ts';

import {dateStr} from '../helpers.ts';

type item = {
	id:number,
	title :string,
	description:string,
	image_file:string,
	start_date:Date,
	last_update:Date,
	spoil_date:Date
}

export async function getLeftoverItems(ctx:Context) {
	let items:Leftover[];
	try {
		items = await getActive();
	} catch(e) {
		ctx.req.respond({status:500, body:e});
		return;
	}

	const headers = new Headers;
	headers.set('Content-Type', 'application/json');
	const resp: Response = {
		status: 200,
		headers: headers,
		body: JSON.stringify(items)
	};
	ctx.req.respond(resp);
}

export async function getLeftoverItem(ctx:Context) {
	const params = <{id:string}>ctx.params;

	let item:Leftover;
	try {
		item = await getByID(Number(params.id));
	} catch(e) {
		ctx.req.respond({status:500, body:e});
		return;
	}

	const headers = new Headers;
	headers.set('Content-Type', 'application/json');

	const resp: Response = {
		status: 200,
		headers: headers,
		body: JSON.stringify(item)
	};
	
	ctx.req.respond(resp);
}

export async function postLeftoverItem(ctx:Context) {
	const req = ctx.req;
	const form_data = await getUploaded(req);

	if( !form_data ) {
		req.respond({status:400});
		return
	}

	if( !form_data.start_date || !form_data.days_to_spoil ) {
		req.respond({status:400});
		return
	}

	const start_date = form_data.start_date;
	const spoil_date = new Date(start_date.valueOf());
	spoil_date.setDate(spoil_date.getDate() + Number(form_data.days_to_spoil))

	const ins_data = {
		title: form_data.title || '',
		description: form_data.description || '',
		start_date: form_data.start_date,
		spoil_date,
		image: form_data.image || '',
		finished: false
	}

	const new_id = await insert(ins_data);

	const headers = new Headers;
	headers.set('Content-Type', 'application/json');
	const resp: Response = {
		status: 200,
		headers: headers,
		body: JSON.stringify({id:new_id})
	};
	ctx.req.respond(resp);
}

// inspired by https://github.com/deligenius/multiparser
const boundaryRegex = /^multipart\/form-data;\sboundary=(?<boundary>.*)$/;

type ItemData = {
	id?: number,	//used later for updates
	title?: string,
	description?: string,
	days_to_spoil?: number,
	start_date?: Date,
	image?:string
}

async function getUploaded(req:ServerRequest) : Promise<ItemData|undefined> {
	const content_type = req.headers.get("content-type");
	if( content_type === null ) return;

	let match = content_type.match(boundaryRegex);
	if (!match) {
    	return
	}
	
	const formBoundary: string = match!.groups!.boundary;
	const reader = new MultipartReader(req.body, formBoundary);
	const formData = await reader.readForm(10 << 20);	// TODO: improve max memory


	let ret :ItemData = {};
	for (let [key, value] of formData.entries()) {
		if( Array.isArray(value) ) throw new Error("Did not expect an array. key: "+key);
		if( typeof value === 'string' ) throw new Error("Did not expect an string. key: "+key);
		if( value?.content === undefined ) throw new Error("no file data in content");

		if( key === 'image' ) {
			ret.image = makeImageFilename();
			const p = path.join(Metadata.appspace_path, 'images', ret.image);
			await Deno.writeFile(p, value.content!)
		} else if (key === 'data') {
			const json_str = new TextDecoder().decode(value.content);
			const data = JSON.parse(json_str);
			Object.assign(ret, data);
		}
	}

	if( Object.keys(ret).length === 0 ) return undefined;
	
	return ret;
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