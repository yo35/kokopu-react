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


const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: false,
		watchOptions: {
			poll: true,
		},
	},
	entry: {
		index: './demo/index.js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Kokopu-React demo',
		}),
	],
	module: {
		rules: [
			{
				test: /\.js$/i,
				loader: 'babel-loader',
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.png$/i,
				type: 'asset/resource',
			},
		],
	}
};
