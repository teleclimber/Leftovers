import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

const prox = {
	target: 'http://localhost:3003',
	changeOrigin: true,
	cookieDomainRewrite: ".localhost",
	secure: false,
	configure: (proxy, options) => {
		proxy.on("proxyReq", (proxyReq, req, res) => {
			console.log("proxy req", req.url);
			//proxyReq.setHeader('x-dev-mode', 'frontend');
		});
	}
};

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir:'../app/frontend/',
		emptyOutDir: true
	},
	server: {
		proxy: {
			'^\/api\/': prox,
			'^\/images\/': prox,
			'^\/avatars\/': prox
		}
	},
	plugins: [
		vue(),
		VitePWA({
			//registerType: 'autoUpdate',
			useCredentials: true,
			manifest: {
				"name": "Leftovers Dropapp",
				"short_name": "Leftovers",
				"start_url": ".",
				"display": "standalone",
				"background_color": "rgb(5, 150, 105)",
				"theme_color": "rgb(5, 150, 105)",
				"description": "Track meal leftovers so you waste less.",
				"icons": [
					{
						"src": "img/icons/favicon-32x32.png",
						"sizes": "32x32",
						"type": "image/png",
						"purpose": "any"
					}, {
						"src": "img/icons/maskable_icon_x512.png",
						"sizes": "512x512",
						"type": "image/png",
						"purpose": "maskable"
					}, {
						"src": "img/icons/maskable_icon_x512.png",
						"sizes": "512x512",
						"type": "image/png",
						"purpose": "any"
					}
				]
			},
			workbox:{
				navigateFallback: null,
				runtimeCaching: [{
					urlPattern: ({_, url}) => {
						return url.pathname.startsWith("/images")
					},
					handler: "CacheFirst",
					options: {
						expiration: {
							maxAgeSeconds: 60*60*24*60,	// 60 days
							purgeOnQuotaError: true
						},
						cacheName: "item-images"
					}
				}]
			},
			devOptions: {
				enabled: false
			}
		})
	]
});
