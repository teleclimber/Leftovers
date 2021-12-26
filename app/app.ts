import DropserverApp from 'https://deno.land/x/dropserver_app/mod.ts';
import {AuthAllow} from 'https://deno.land/x/dropserver_app/routes.ts';
import {getLeftoverItems, getLeftoverItem, postLeftoverItem, patchLeftoverItem} from './handlers/leftovers.ts';
import {getCurrentUser, getUser} from './handlers/users.ts';
import {getCreateDB} from './db.ts';

console.log("in app.ts"); 

const app = new DropserverApp;

app.registerMigrations( async (reg) => {
	console.log("leftovers registering migrations");
	reg.upTo(1, async () => {
		console.log("creating db");
		const db = getCreateDB();
	
		console.log("creating table");
		db.query(`CREATE TABLE "leftovers" (
				"id" INTEGER PRIMARY KEY ASC,
				"title" TEXT,
				"description" TEXT,
				"start_date" DATETIME,
				"spoil_date" DATETIME,
				"image" TEXT,
				"finished" INTEGER,
				"proxy_id" TEXT
			)`);
	
		console.log("creating index");
		db.query(`CREATE INDEX active ON leftovers (spoil_date, finished)`);
	
		db.close();
	
		// create a dir for the images:
		const images_path = appspace.path('images');
		console.log("images path: "+images_path);
		await Deno.mkdir(images_path);
	});
});


//
const r = app.routes;
const publicRoute = {allow:AuthAllow.public};
const authorizedOnly = {allow:AuthAllow.authorized};
const createAuth = {allow:AuthAllow.authorized, permissions:"create"}

// leftover items CRUD:
r.add("get", "/api/leftovers", authorizedOnly, getLeftoverItems);
r.add("get", "/api/leftovers/:id", authorizedOnly, getLeftoverItem);
r.add("post", "/api/leftovers", createAuth, postLeftoverItem);
r.add("patch", "/api/leftovers/:id", authorizedOnly, patchLeftoverItem);

// images 
r.add("get", {path:"/images", end:false}, authorizedOnly, r.staticFileHandler({path:'@appspace/images/'}));

// users:
r.add("get", "/api/current-user", authorizedOnly, getCurrentUser)
r.add("get", "/api/users/:proxy_id", authorizedOnly, getUser);

// user avatars...
r.add("get", {path:"/avatars", end: false}, authorizedOnly, r.staticFileHandler({path:'@avatars/'}));
// there could be a convenient r.serveAvatars("at_path", auth)

// frontend. if bare path then serve index
r.add("get", "/", authorizedOnly, r.staticFileHandler({path:'@app/frontend/index.html'}));
// For now, frontend routes that should serve the app are manualy added here:
r.add("get", {path:"/new", end:false}, authorizedOnly, r.staticFileHandler({path:'@app/frontend/index.html'}));
r.add("get", {path:"/leftovers", end:false}, authorizedOnly, r.staticFileHandler({path:'@app/frontend/index.html'}));
// serve pwa icons using public routes (sadly) because credentials are not sent
r.add("get", {path:"/img/icons/", end: false}, publicRoute, r.staticFileHandler({path:'@app/frontend/img/icons/'}));
// serve static frontend assets:
r.add("get", {path:"/", end:false}, authorizedOnly, r.staticFileHandler({path:'@app/frontend/'}));
// !! We'll need a way to send index.hml if no file found.

// helpful for app code:
const appspace = app.appspace;
export { appspace };

// required
export default app;