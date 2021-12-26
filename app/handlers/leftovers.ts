import * as path from "https://deno.land/std@0.106.0/path/mod.ts";
import type {ServerRequest, Response} from "https://deno.land/std@0.106.0/http/server.ts";
import { MultipartReader } from "https://deno.land/std@0.106.0/mime/multipart.ts";
import type { Context} from 'https://deno.land/x/dropserver_app/routes.ts';
import {appspace} from '../app.ts'; 

import {insert, update, getByID, getActive}  from '../models/leftovers.ts';
import type {Leftover, UpdateData} from '../models/leftovers.ts';

import {dateStr} from '../helpers.ts';

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
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in postLeftoverItem");

	const req = ctx.req;
	const form_data = await getUploaded(req);

	if( !form_data ) {
		req.respond({status:400});
		return
	}

	if( !form_data.start_date || !form_data.spoil_date ) {
		req.respond({status:400});
		return
	}

	const ins_data = {
		title: form_data.title || '',
		description: form_data.description || '',
		start_date: form_data.start_date,
		spoil_date: form_data.spoil_date,
		image: form_data.image || '',
		finished: false,
		proxy_id: ctx.proxyId
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


export async function patchLeftoverItem(ctx:Context) {
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in postLeftoverItem");

	const req = ctx.req;
	const form_data = await getUploaded(req);

	if( !form_data ) {
		req.respond({status:400});
		return
	}

	// Actually no let's get id from path?
	const params = <{id:string}>ctx.params;
	const id = Number(params.id);

	const update_data:UpdateData = {
		image_mode: '',
		proxy_id: ctx.proxyId
	};
	Object.assign( update_data, form_data);

	await update(id, update_data);

	ctx.req.respond({status:200});
}

// inspired by https://github.com/deligenius/multiparser
const boundaryRegex = /^multipart\/form-data;\sboundary=(?<boundary>.*)$/;

export type ItemData = {
	title?: string,
	description?: string,
	start_date?: Date,
	spoil_date?: Date,
	image_mode: string,
	image?:string,
	finished?:boolean
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

	let ret :ItemData = {image_mode:''};
	for (let [key, values] of formData.entries()) {
		if( values === undefined ) throw new Error("Did not expect undefined value for key: "+key);
		if( values.length !== 1 ) throw new Error("Should only be one value for multipart key: "+key);
		const value = values[0];
		if( Array.isArray(value) ) throw new Error("Did not expect an array. key: "+key);
		if( typeof value === 'string' ) throw new Error("Did not expect an string. key: "+key);
		if( value?.content === undefined ) throw new Error("no file data in content");

		if( key === 'image' ) {
			ret.image = makeImageFilename();
			const p = appspace.path(path.join('images', ret.image));
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

// https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
function escapeHtml(unsafe:string):string {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }