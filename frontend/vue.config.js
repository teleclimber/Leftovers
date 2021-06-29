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
			"/images": {
				target: "http://localhost:3003",
				changeOrigin: true,
			},
		}
	}
}