import type {Context} from "https://deno.land/x/dropserver_app@v0.2.0/mod.ts"
import app from '../app.ts';

export async function getCurrentUser(ctx:Context) {
	if( ctx.proxyId === null ) {
		ctx.respondWith(new Response("", {status:204}));	// 204 "no content" 
		return;
	}
	const user = await app.getUser(ctx.proxyId);	// Don't love this because it implies we're dealing with "app". It should be "appspace"?
	ctx.respondWith(Response.json(user));
}

export async function getUser(ctx:Context) {
	const params = <{proxy_id:string}>ctx.params;
	if( !params.proxy_id ) {
		ctx.respondWith(new Response("no proxy_id", {status:400}));
		return;
	}
	const user = await app.getUser(params.proxy_id);
	ctx.respondWith(Response.json(user));
}

// Leftovers app typical use case includes only a handful of users 
// so send all users in one handler and be done with it.
export async function getAllUsers(ctx:Context) {
	const users = await app.getUsers();
	ctx.respondWith(Response.json(users));
}