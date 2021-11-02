import { ref, Ref } from 'vue';
import { register } from 'register-service-worker';

class swr {
	registration: Ref<ServiceWorkerRegistration|undefined> = ref(undefined);
	update_exists: Ref<boolean> = ref(false);
	refreshing = false;
	
	constructor() {
		if( 'serviceWorker' in navigator ) {
			navigator.serviceWorker.addEventListener('controllerchange', () => {
				if (this.refreshing) return;
				this.refreshing = true;
				window.location.reload();
			});
		}
		window.addEventListener('focus', () => {
			this.refreshSW();
		});
	}

	refreshSW() {
		if( !this.registration.value ) {
			console.log("not registration to allow refreshing");
			return;
		}
		console.log("refreshing service worker");
		this.registration.value.update();
	}

	register() {
		register( '/sw.js', {
			ready: (registration) => {
				console.log('Service worker is active.', registration);
				this.registration.value = registration;
			},
			registered: (registration) => {
				console.log('Service worker has been registered.', registration);
				this.registration.value = registration;
			},
			cached: (registration) => {
				console.log('Content has been cached for offline use.', registration);
				this.registration.value = registration;
			},
			updatefound: (registration) => {
				console.log('New content is downloading.', registration);
				this.registration.value = registration;
			},
			updated: (registration) => {
				console.log('New content is available; please refresh.', registration);
				this.registration.value = registration;
				this.update_exists.value = true;
			},
			offline () {
				console.log('No internet connection found. App is running in offline mode.')
			},
			error (error) {
				console.error('Error during service worker registration:', error)
			}
		});
	}

	refreshApp() {
		this.update_exists.value = false;
		if( !this.registration.value || !this.registration.value.waiting ) return;
		console.log("sneding skip waiting to SW");
		this.registration.value.waiting.postMessage({type: 'SKIP_WAITING'});
	}
}

const SWReg = new swr;
export default SWReg;


