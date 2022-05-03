import { reactive, ref, Ref } from 'vue';
import ax from '../axios';

// how do we handle this?
// Don't want to reload the whole list each time?
// But if a user is added to appspace, then other users should not have to refresh the page.
// -> load all users, then load unknown users as needed?

// -> also how to handle changes, like user display name?

// One option actually would be to use http caching!
// -> request all users on each view, but cache the response, 
// ..and therefore can expect to load no data if nothing changed
// -> would handle both new user, and any change within users.



export class User {
	loaded = false;

	proxy_id: string = "";
	permissions: string[] = [];
	displayName: string = "";
	avatar: string = "";

	setFromRaw(raw :any) {
		this.proxy_id = raw.proxyId+'';
		this.permissions = raw.permissions;
		this.displayName = raw.displayName+'';
		this.avatar = raw.avatar+'';

		this.loaded = true;
	}
	async fetchCurrent() {
		const resp_data = await ax.get('/api/current-user/');
		if( resp_data.status === 200 ) this.setFromRaw(resp_data.data);
	}
}


// This is meant to be a reactive class instance 
// that is common to all modules, 
// such taht it doesn't constantly refetch users.
// Unhandled: how  are changes to users reloaded? 
class Users {

	by_proxy: Map<string,User> = new Map;
	current: User = new User;

	authenticated = true;

	async fetchAll() {
		const resp = await ax.get('/api/users');
		resp.data.forEach( this.ingestRaw );
	}
	async fetchCurrent() {
		const resp_data = await ax.get('/api/current-user/');
		if( resp_data.status === 200 ) {
			const c = this.ingestRaw(resp_data.data);
			this.current.setFromRaw(resp_data.data);	// eh, doing this twice?
		}
	}
	ingestRaw(raw:any) : User{
		let u = new User;
		u.setFromRaw(raw);
		const existing = this.by_proxy.get(u.proxy_id);
		if( existing !== undefined) {
			existing.setFromRaw(raw);
			return existing;
		}
		else {
			this.by_proxy.set(u.proxy_id, u);
			return u;
		}
	}

	getUser(proxy_id: string) :User {
		const u = this.by_proxy.get(proxy_id);
		if( u !== undefined ) return u;
		
		// not found, so put it in and fetch
		const n = reactive(new User);
		this.by_proxy.set(proxy_id, n);
		ax.get('/api/users/'+proxy_id).then( (resp:any) => {
			this.ingestRaw(resp.data);
		});
		return n;
	}
}

export const ReactiveUsers = reactive(new Users)