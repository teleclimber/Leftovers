import * as path from "https://deno.land/std@0.159.0/path/mod.ts";
import type {Context} from "https://deno.land/x/dropserver_app@v0.2.0/mod.ts"

import app from '../app.ts'; 

import {insert, update, getByID, getActive}  from '../models/leftovers.ts';
import type {Leftover, UpdateData} from '../models/leftovers.ts';

import {dateStr} from '../helpers.ts';

export async function getLeftoverItems(ctx:Context) {
	let items:Leftover[];
	try {
		items = await getActive();
	} catch(e) {
		ctx.respondWith(new Response(e, {status:500}));
		return;
	}
	ctx.respondWith(Response.json(items));
}

export async function getLeftoverItem(ctx:Context) {
	const params = <{id:string}>ctx.params;

	let item:Leftover;
	try {
		item = await getByID(Number(params.id));
	} catch(e) {
		ctx.respondWith(new Response(e, {status:500}));
		return;
	}

	const headers = new Headers;
	headers.set('Content-Type', 'application/json');
	const resp = new Response( JSON.stringify(item), {
		status: 200,
		headers: headers,
	});
	ctx.respondWith(resp);
}

export async function postLeftoverItem(ctx:Context) {
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in postLeftoverItem");

	const form_data = await getUploaded(ctx.request);
	if( !form_data ) {
		ctx.respondWith(new Response("", {status:400}));
		return
	}
	if( !form_data.start_date || !form_data.spoil_date ) {
		ctx.respondWith(new Response("", {status:400}));
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

	ctx.respondWith(Response.json({id:new_id}));
}


export async function patchLeftoverItem(ctx:Context) {
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in postLeftoverItem");

	const form_data = await getUploaded(ctx.request);

	if( !form_data ) {
		ctx.respondWith(new Response("", {status:400}));
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

	ctx.respondWith(new Response("", {status:200}));
}

export type ItemData = {
	title?: string,
	description?: string,
	start_date?: Date,
	spoil_date?: Date,
	image_mode: string,
	image?:string,
	finished?:boolean
}

async function getUploaded(req:Request) : Promise<ItemData|undefined> {
	const formData = await req.formData();

	const ret :ItemData = {image_mode:''};
	for (const [key, value] of formData.entries()) {
		if( key === 'data' ) {
			const jsonStr = await (value as File).text()
			const data = JSON.parse(jsonStr);
			Object.assign(ret, data);
		}
		if( key === 'image' ) {
			ret.image = makeImageFilename();
			const p = app.appspacePath(path.join('images', ret.image));
			const buffer = await (value as File).arrayBuffer();
			await Deno.writeFile(p, new Uint8Array(buffer));
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
