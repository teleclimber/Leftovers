import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/tailwind.css';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

createApp(App).use(router).mount('#app')
