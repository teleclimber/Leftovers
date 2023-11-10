import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { registerSW } from 'virtual:pwa-register';

import './assets/tailwind.css';

const updateSW = registerSW({
	onNeedRefresh() {
		if( confirm("New service worker is ready. Confirm please.") ) updateSW();
	},
	//onOfflineReady() {},
});


import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

createApp(App).use(router).mount('body');
