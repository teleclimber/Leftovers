import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/tailwind.css';

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register("/sw.js").then( (reg) => {
		console.log("service worker registration: ", reg);
	});
}
else {
	console.log("no serviceWorker in navigator");
}

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

createApp(App).use(router).mount('#app');
