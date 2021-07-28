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


const path = require('path');
const version = require('../package.json').version;

module.exports = {
	styleguideDir: '../dist/docs',
	webpackConfig: {
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
	},
	usageMode: 'expand',
	exampleMode: 'expand',
	getComponentPathLine: function(componentPath) {
		let componentName = path.basename(componentPath, '.js');
		return `import { ${componentName} } from kokopu-react;`;
	},
	getExampleFilename: function(componentPath) {
		let componentName = path.basename(componentPath, '.js');
		return path.dirname(componentPath) + '/../doc_src/examples/' + componentName + '.md';
	},
	pagePerSection: true,
	sections: [
		{
			name: 'Components',
			components: '../src/[A-Z]*([A-Za-z0-9]).js',
			sectionDepth: 1
		},
	],
	title: 'Kokopu-React documentation',
	version: version
}
