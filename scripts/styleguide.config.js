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
const version = require('../package.json').version;

const demoPages = [
	{ id: 'ChessboardBase', title: 'Chessboard - Basic features' },
	{ id: 'ChessboardEdition', title: 'Chessboard - Edition' },
	{ id: 'ChessboardMove', title: 'Chessboard - Display moves' },
	{ id: 'ChessboardSmallScreens', title: 'Chessboard - Small screens' },
];

const docSrcDir = '../doc_src';
const srcDir = '../src';
const tmpDir = '../build/tmp_docs';


// Generate the Markdown file corresponding to each demo page.
fs.mkdirSync(path.resolve(__dirname, tmpDir), { recursive: true });
demoPages.forEach(demoPage => {
	let filename = path.resolve(__dirname, `${tmpDir}/${demoPage.id}.md`);
	fs.writeFileSync(filename,
		'```js\n' +
		`<Page${demoPage.id} />\n` +
		'```\n'
	);
});

// Retrieve the components to document (-> all the .js files starting with a capital in src root directory).
let components = fs.readdirSync(path.resolve(__dirname, srcDir)).filter(filename => /^[A-Z].*\.js$/.test(filename)).map(filename => path.basename(filename, '.js'));

// Define the symbols available for example blocks in documentation.
let componentContext = Object.fromEntries(components.map(componentName => [ componentName, path.resolve(__dirname, `${srcDir}/${componentName}`) ]));
let demoContext = Object.fromEntries(demoPages.map(demoPage => [ 'Page' + demoPage.id, path.resolve(__dirname, `${docSrcDir}/demo/Page${demoPage.id}`) ]));


// Styleguidist config.
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
	context: Object.assign({}, componentContext, demoContext),
	getComponentPathLine: componentPath => `import { ${path.basename(componentPath, '.js')} } from kokopu-react;`,
	getExampleFilename: componentPath => path.resolve(__dirname, `${docSrcDir}/examples/${path.basename(componentPath, '.js')}.md`),
	pagePerSection: true,
	sections: [
		{
			name: 'Home',
			content: `${docSrcDir}/home.md`,
		},
		{
			name: 'Components',
			components: components.map(componentName => `${srcDir}/${componentName}.js`),
			sectionDepth: 1
		},
		{
			name: 'Live demo',
			sectionDepth: 1,
			sections: demoPages.map(demoPage => {
				return {
					name: demoPage.title,
					content: `${tmpDir}/${demoPage.id}.md`,
					exampleMode: 'hide'
				};
			}),
		},
		{
			name: 'Kokopu core library documentation',
			href: 'https://kokopu.yo35.org/',
		},
	],
	styleguideComponents: {
		LogoRenderer: path.resolve(__dirname, `${docSrcDir}/theming/LogoRenderer`),
	},
	theme: {
		sidebarWidth: 300,
	},
	title: 'Kokopu-React documentation',
	version: version,
}
