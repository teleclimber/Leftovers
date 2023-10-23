import {reactive } from 'vue';
import axios from 'axios';
import {ReactiveUsers} from './models/users';

type Err = {
	method: string,
	path: string,
	code:number,
	message: string
}
class ReqErrStack_ {
	errs: Err[] = [];

	push(err:Err) {
		this.errs.push(err);
	}
}
export const ReqErrStack = reactive(new ReqErrStack_);

const ax = axios.create();
ax.interceptors.response.use(function (response) {
	return response;
}, function (error) {
	if( error.response && error.response.status >= 400 ) {
		const resp = error.response;
		if( resp.status == 401 || resp.status == 403 ) ReactiveUsers.authenticated = false;
		else {	// if( resp.status != 404 ) {
			ReqErrStack.push({method:resp.config.method, path:resp.config.url, code: resp.status, message: resp.data});
		}
	}

	return Promise.reject(error);
});

export default ax;