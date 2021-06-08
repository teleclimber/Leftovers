// See https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip

export default class Update {
	private _update_exists = false;
	private registration : ServiceWorkerRegistration | undefined = undefined;	//or registration type
	init() {
		document.addEventListener('swUpdated', ((event: CustomEvent) => {
			console.log("updater got swUpdate event");
			this._update_exists = true;
			this.registration = <ServiceWorkerRegistration>event.detail
		}) as EventListener, {once:true});
		// see https://github.com/Microsoft/TypeScript/issues/28357 for custom events and typescript
	}
	get update_exists() {
		return this._update_exists;
	}
	refreshApp() {
		this._update_exists = false;
		// Make sure we only send a 'skip waiting' message if the SW is waiting
		if (!this.registration || !this.registration.waiting) return
    	// send message to SW to skip the waiting and activate the new SW
    	this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
	}
}
