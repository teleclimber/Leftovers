import AppRouter, {AuthAllow} from '@dropserver/app-router.ts';
import {getLeftoverItems, getLeftoverItem, postLeftoverItem, patchLeftoverItem} from './handlers/leftovers.ts';
import {getCurrentUser, getUser} from './handlers/users.ts';

const r = new AppRouter;

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
r.add("get", {path:"/", end:false}, authorizedOnly, r.staticFileHandler({path:'@app/frontend/'}));
// !! We'll need a way to send index.hml if no file found.

const router = r;
export default router;