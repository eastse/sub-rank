const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
	mode: 'production' || 'development',
	// webpack 打包开始文件
	entry: {
		index: "./src/index.ts"
	},
	output: {
		// path: path.resolve(__dirname, "sub"), // 打包后的输出目录
		path: path.resolve('/Users/chenhaidong/Documents/work/SubRank/main/build/wechatgame', "sub"), // 打包后的输出目录
		filename: "index.js"
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'babel-loader',
				// exclude: /node_modules/
			},
			{
				test: /\.js?$/,
				use: 'babel-loader',
				// exclude: /node_modules/,
				// use: {
				// 	loader: "babel-loader"
				// }
			},
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: 'res',
				to: 'res'
			}
		])
	]
}
