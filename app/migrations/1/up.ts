import * as path from "https://deno.land/std@0.97.0/path/mod.ts";
import Metadata from '@dropserver/ds-metadata.ts';
import Routes, {FileHandler, FunctionHandler} from '@dropserver/appspace-routes-db.ts';

export default async function() {
	await sleep();

	const main_handler :FileHandler = {
		type:"file",
		path:"@app/frontend/"
	};
	await Routes.createRoute(["get"], "/", {allow:"authorized"}, main_handler);

	const get_items:FunctionHandler = {
		type:"function",
		file:"@app/leftovers.ts",
		function: "getLeftoverItems"
	};
	await Routes.createRoute(["get"], "/api/leftovers", {allow:"authorized"}, get_items);

	// const upload_handler :FunctionHandler = {
	// 	type:"function",
	// 	file:"@app/leftovers.ts",
	// 	function: "uploadRoute"
	// };
	// await Routes.createRoute(["post"], "/upload", {allow:"authorized", permission:"create"}, upload_handler);

	// // create a dir for the images:
	// const images_path = path.join(Metadata.appspace_path, 'images');
	// console.log("images path: "+images_path);
	// await Deno.mkdir(images_path);

	// const images_handler :FileHandler = {
	// 	type:"file",
	// 	path:"@appspace/images/"
	// };
	// await Routes.createRoute(["get"], "/leftovers/", {allow:"authorized"}, images_handler);

	// const archive_handler :FunctionHandler = {
	// 	type:"function",
	// 	file:"@app/leftovers.ts",
	// 	function: "archiveRoute"
	// };
	// await Routes.createRoute(["post"], "/archive", {allow:"authorized", permission:"archive"}, archive_handler);

	
}

function sleep() :Promise<void> {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, 1000);
	});
}
