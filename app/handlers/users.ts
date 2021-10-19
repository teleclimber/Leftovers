import type {Response} from "https://deno.land/std@0.106.0/http/server.ts";
import type {Context} from '@dropserver/app-router.ts';
import Users from '@dropserver/appspace-users.ts';

export async function getCurrentUser(ctx:Context) {
	if( ctx.proxy_id === null ) {
		ctx.req.respond({status:204});	// 204 "no content" 
		return;
	}
	const user = await Users.getUser(ctx.proxy_id);

	const headers = new Headers;
	headers.set('Content-Type', 'application/json');
	const resp: Response = {
		status: 200,
		headers: headers,
		body: JSON.stringify(user)
	};
	ctx.req.respond(resp);
}


export async function getUser(ctx:Context) {
	const params = <{proxy_id:string}>ctx.params;
	if( !params.proxy_id ) {
		ctx.req.respond({status:400, body:"no proxy_id"});
		return;
	}
	const user = await Users.getUser(params.proxy_id);

	const headers = new Headers;
	headers.set('Content-Type', 'application/json');
	const resp: Response = {
		status: 200,
		headers: headers,
		body: JSON.stringify(user)
	};
	ctx.req.respond(resp);
}

// Leftovers app typical use case includes only a handful of users 
// so send all users in one handler and be done with it.
export async function getAllUsers(ctx:Context) {
	const users = await Users.getAllUsers();

	const headers = new Headers;
	headers.set('Content-Type', 'application/json');
	const resp: Response = {
		status: 200,
		headers: headers,
		body: JSON.stringify(users)
	};
	ctx.req.respond(resp);
}