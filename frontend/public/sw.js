// Now we have changed our frontend so we have different assets.
// How to deal?
// -> leav as is: OK because apparently addAll reloads everything even if it's already in the cache.
//    ..except this might break running clients
// -> increment static cache to v2:
// -> iterate over array of things to cache, load if not in cache, then delete from cache things that are not in array
//    ..more complicated, but may save some data
//    .. also need to always reload index.html in these cases.
//    -> Also this can potentially break running clients that are still on the older sw.

// Hang on! new service worker installed only if sw is byte-different.
// so if none of our sw code changes, and the asset names haven't changed
// then sw will not get reloaded!
// -> in future, the hashed filenames in addAll() naturally corrects this problem.

const STATIC_CACHE = 'static-v1';
const DATA_CACHE = 'data-v1';

self.addEventListener('install', (event) => {
	event.waitUntil(cacheAssets());
});

self.addEventListener('activate', function (event) {
	event.waitUntil(removeOldCaches());	// why are we waiting? Just activate.
});

async function cacheAssets() {
	const cache = await caches.open(STATIC_CACHE);
	await cache.addAll([
		'snowpack-service-worker-assets'
	]);
}

async function removeOldCaches() {
	const cacheKeys = await caches.keys();
	return Promise.all(
		cacheKeys.filter( k => k !== STATIC_CACHE && k !== DATA_CACHE ) // Return true if you want to remove this cache
			.map( k => caches.delete(k) )
	);
}

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		console.log("calling skip waiting from SW");
		self.skipWaiting();
	}
});

// so now the qeustion is do we try to just cache all requests,
// or do we have a laser-focused attempt to fully cache current items?
// Let's try the latter.

async function cacheCurrentLeftovers() {
	console.log("cacheCurrentLeftovers()");
	const url = '/api/leftovers/';
	const cache = await caches.open(DATA_CACHE);
	const resp = await fetch(url);
	if( !resp.ok ) return;	// I think?
	
	const items = await resp.clone().json(); 	//have to clone because apparently you can't read a response twice
	const img_urls = items.filter( item => item.image ).map( item => `/images/${item.image}`);

	// prolly need to cache users or somesuch

	return Promise.all(cache.put(url, resp), cache.addAll(img_urls));
}

// ^^ OK but need to delete old images or this is just going to grow and grow.

// then you also need to take advantage of that cache

self.addEventListener('fetch', (event) => {
	
	const u = new URL(event.request.url);
	const p = u.pathname;
	const m = event.request.method;

	if( u.protocol !== 'http:' && u.protocol !== 'https:' ) {
		console.log("fetching directly because protocol not recognized: "+u.protocol);
		event.respondWith(fetch(event.request));
	}
	else if( m === 'POST' || m === 'PATCH' ) {
		event.respondWith(handleMutation(event));
	}
	else if( p.startsWith('/api/') ) {
		event.respondWith(fetchMutable(event));
	}
	else if( p.startsWith('/images') ) {
		event.respondWith(fetchImmutable(event));
	}
	else if( p.startsWith('/avatars') ) {
		event.respondWith(fetchImmutable(event));
	}
	else {
		// for now assume all mutable.
		event.respondWith(fetchMutable(event));
		// When we have filenames with hashes then "/" (index) is mutable,
		// and so is sw.js and manifest.json so it can be updated
		// everything else immutable
		// Actually consider index, etc as cache-then-revalidate, so it loads quicly?
		// Or could even cache index as immutable, since a new sw would load it into a new cache anyways
	}
});

// Note for below: fetch rejects promise when "network error" occurs.
// Which includes apparently a dead server (makes sense)

async function fetchImmutable(event) {
	const cache = await caches.open(DATA_CACHE);
	let resp = await cache.match(event.request);
	if( resp ) return resp;
	try {
		resp = await fetch(event.request);
	}
	catch(e) {
		return new Response(null, {status:503, statusText: "Failed to reach server"});
	}
	if( resp.ok ) cache.put(event.request, resp.clone());
	return resp;
}

async function fetchMutable(event) {
	let resp;
	let req_fail = false;
	try {
		resp = await fetch(event.request);
	}
	catch(e) {
		req_fail = true;
	}
	const cache = await caches.open(DATA_CACHE);
	if( !req_fail && resp && resp.ok ) {
		cache.put(event.request, resp.clone());
		return resp;
	}
	resp = await cache.match(event.request);
	if( resp ) {
		// if( req_fail ) ..add "Maybe-Stale" or something to headers?
		return resp;
	}
	return new Response(null, {status:503, statusText: "Failed to reach server and nothing in cache"});
}

// Basically assume that any mutation might change the current leftovers,
// therefore reload them. It's a bit much and may result in excess data use,
// but OK for now.
async function handleMutation(event) {
	resp = await fetch(event.request);
	cacheCurrentLeftovers();
	return resp;
}

