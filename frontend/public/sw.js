
// service worker:
// - install: do things to prepare for use. If there is an old sw, that one is still used.
// - activate: things to do when old sw is no longer active (like delete old stuff)
// - 


const CACHE_VERSION = 'v1';

self.addEventListener('install', (event) => {
	event.waitUntil(cacheAssets());
});

async function cacheAssets() {
	const cache = await caches.open(CACHE_VERSION)
	await cache.addAll([
		'snowpack-service-worker-assets'
	]);
}


