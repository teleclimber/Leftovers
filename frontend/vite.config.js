import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

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
	plugins: [vue()]
});
