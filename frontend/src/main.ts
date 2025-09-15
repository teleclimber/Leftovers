import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register';
import { useLeftoverItemsStore } from './models/leftovers';

import './assets/tailwind.css';

const pinia = createPinia();

const updateSW = registerSW({
	onNeedRefresh() {
		if( confirm("A new version of the Leftovers app is ready. Press OK to reload.") ) updateSW();
	},
	//onOfflineReady() {},
});


import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

createApp(App).use(pinia).use(router).mount('body');

const leftoverItemsStore = useLeftoverItemsStore();

document.addEventListener("visibilitychange", () => {
	if (!document.hidden) {
		leftoverItemsStore.fetchActive(true);
	}
});
