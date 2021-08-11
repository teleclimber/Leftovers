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
		},
	],
};

