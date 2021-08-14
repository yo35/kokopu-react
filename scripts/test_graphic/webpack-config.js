/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021  Yoann Le Montagner <yo35 -at- melix.net>            *
 *                                                                            *
 *    This program is free software: you can redistribute it and/or           *
 *    modify it under the terms of the GNU Lesser General Public License      *
 *    as published by the Free Software Foundation, either version 3 of       *
 *    the License, or (at your option) any later version.                     *
 *                                                                            *
 *    This program is distributed in the hope that it will be useful,         *
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of          *
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the            *
 *    GNU Lesser General Public License for more details.                     *
 *                                                                            *
 *    You should have received a copy of the GNU Lesser General               *
 *    Public License along with this program. If not, see                     *
 *    <http://www.gnu.org/licenses/>.                                         *
 *                                                                            *
 ******************************************************************************/


const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// List all the JS files in /test/graphic, each of them corresponding to a entry.
var items = fs.readdirSync('./graphic_test_app').filter(filename => path.extname(filename) === '.js').map(filename => path.basename(filename, '.js')).sort();
var entries = {};
items.forEach(item => {
	entries[item] = `./graphic_test_app/${item}.js`;
});

// Define the outputs.
var plugins = items.map(item => new HtmlWebpackPlugin({
	title: 'Test ' + item,
	chunks: [ item ],
	filename: item + '/index.html',
}));
plugins.push(new CopyWebpackPlugin({
	patterns: [ { from: './graphic_test_app/common/healthcheck.txt', to: 'healthcheck.txt' } ],
}));

module.exports = {
	mode: 'development',
	entry: entries,
	output: {
		path: path.resolve(__dirname, '../../build/test_graphic'),
	},
	plugins: plugins,
	module: {
		rules: [
			{
				test: /\.js$/i,
				use: {
					loader: 'babel-loader',
					options: {
						plugins: [ 'istanbul' ],
					},
				},
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|txt)$/i,
				type: 'asset/resource',
			},
		],
	}
};
