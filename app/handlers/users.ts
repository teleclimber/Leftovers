import type {Context, Response} from '../deps.ts';
import app from '../app.ts';

export async function getCurrentUser(ctx:Context) {
	if( ctx.proxyId === null ) {
		ctx.req.respond({status:204});	// 204 "no content" 
		return;
	}
	const user = await app.getUser(ctx.proxyId);	// Don't love this because it implies we're dealing with "app". It should be "appspace"?

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
	const user = await app.getUser(params.proxy_id);

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
	const u = await app.getUsers();
	const headers = new Headers;
	headers.set('Content-Type', 'application/json');
	const resp: Response = {
		status: 200,
		headers: headers,
		body: JSON.stringify(u)
	};
	ctx.req.respond(resp);
}