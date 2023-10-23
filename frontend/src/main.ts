import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import SWReg from './sw_registration';

import './assets/tailwind.css';

SWReg.register();

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

createApp(App).use(router).mount('body');
