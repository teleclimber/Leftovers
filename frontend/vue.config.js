const path = require("path");

module.exports = {
    outputDir: path.resolve(__dirname, "../app/frontend"),

    devServer: {
		hot: true,
		proxy: {
			"/api": {
				target: "http://localhost:3003",
				changeOrigin: true,
			},
			"/avatars": {
				target: "http://localhost:3003",
				changeOrigin: true,
			},
			"/images": {
				target: "http://localhost:3003",
				changeOrigin: true,
			},
		}
	},

    pwa: {
		name: 'Leftovers',
		themeColor: 'rgba(5,150,105,1)',
		workboxOptions: {
			importWorkboxFrom: 'local',
		},
		manifestCrossorigin: "use-credentials",
		manifestOptions: {
			icons:[{
				"src": "img/icons/maskable_icon_x512.png",
				"sizes": "152x152",
				"type": "image/png",
				"purpose": "maskable" 
			}]
		}
    }
}