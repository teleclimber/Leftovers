import proxy from 'http2-proxy';

const prox = (req, res) => {
	return proxy.web(req, res, {
		hostname: 'localhost',
		port: 3003,
	});
}

export default {
	mount: {
		'src': '/dist',
		'public': '/',
	},
	devOptions: {
		tailwindConfig: './tailwind.config.js',
	},
	buildOptions: {
		out: '../app/frontend'
	},
	optimize: {
		bundle: true,
		minify: true,
		target: 'es2018',
	},
	plugins: [
		'@snowpack/plugin-vue',
		'@snowpack/plugin-postcss',
		// [
		// 	'snowpack-plugin-hash',
		// 	// Entirely optional object. Showing default values
		// 	{ 
		// 	  // Name of custom tsconfig to use for compiler options passed to TypeScript compiler
		// 	  //readonly tsConfig?: undefined
		// 	  // Configured length of your hashes
		// 	  //readonly hashLength?: number
		// 	  // Name of file for asset manifest JSON
		// 	  //readonly assetManifest?: string
		// 	  //assetManifest: ""
		// 	  // BaseURL to use to rewrite files being hashed
		// 	  //readonly baseUrl?: string
		// 	  // Configure log level of plugin, 'error' | 'info' | 'debug'
		// 	  //readonly logLevel?: 'info'
		// 	  logLevel: 'debug',
		// 	  // If the build succeeds, a file at this path will produce a JSON representing the AST generated
		// 	  //readonly registryFile?: undefined 
		// 	  registryFile: 'hashreg.json',
		// 	  // Defaults the your buildOptions config, but can be used to override.
		// 	  //readonly sourceMaps?: boolean
		// 	}
		// ],

		// [
		// 	"snowpack-files-hash",
		// 	{
		// 		// Path to be treated as absolute in relation to root project for imported assets as absolute. Ex.: "/build"
		// 		baseUrl: "",
		// 		// Files will be hashed. Ex.: "js", "css", "png", "svg", "jpg"
		// 		hashFiles: ["js", "css"],
		// 		// Files will be excludes
		// 		exclude: ["snowpack.config.js"],
		// 		// Lenght of hash
		// 		hashLength: 6,
		// 		// Files where to find and replace files that have been hashed
		// 		searchImportsIn: ["html", "js"],
		// 	},
		// ],

		[
			'snowpack-service-worker-assets',
			{
				patterns:['**/*', '!**/*.map', '!sw.js', '!**/*.json'],
				worker: 'sw.js',
			}
		]
	],
	routes: [
		{
			src: '/api/.*',
			dest: prox
		},{
			src: '/avatars/.*',
			dest: prox
		},{
			src: '/images/.*',
			dest: prox
		},{
			match: 'routes',
			src: '.*',
			dest: '/index.html',
		}
	],
};

