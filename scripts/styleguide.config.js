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


const docSrcDir = '../doc_src';
const srcDir = '../src';
const tmpDir = '../build/tmp_docs';

fs.mkdirSync(path.resolve(__dirname, tmpDir), { recursive: true });


// Component section configuration
// -------------------------------

const componentSectionTitle = 'Components';
const components = fs.readdirSync(path.resolve(__dirname, srcDir)).filter(filename => /^[A-Z].*\.js$/.test(filename)).map(filename => path.basename(filename, '.js'));


// Demo section configuration
// --------------------------

const demoSectionTitle = 'Live demo';
const demoPages = [
	{ id: 'ChessboardBase', title: 'Chessboard - Basic features' },
	{ id: 'ChessboardEdition', title: 'Chessboard - Edition' },
	{ id: 'ChessboardMove', title: 'Chessboard - Display moves' },
	{ id: 'ChessboardSmallScreens', title: 'Chessboard - Small screens' },
];


// Build the documentation
// -----------------------

// Generate the Markdown file corresponding to each demo page.
demoPages.forEach(demoPage => {
	let filename = `${tmpDir}/${demoPage.id}.md`;
	fs.writeFileSync(path.resolve(__dirname, filename),
		'```js\n' +
		`<Page${demoPage.id} />\n` +
		'```\n'
	);
	demoPage.filename = filename;
});

// Generate the table of contents for each sections with sub-sections.
function generateTableOfContents(parentName, itemNames) {
	let text = itemNames.map(itemName => {
		let link = `#/${parentName}/${itemName}`.replace(/ /g, '%20');
		return `- [${itemName}](${link})\n`;
	}).join('');
	let filename = `${tmpDir}/Header_${parentName.replace(/ /g, '_')}.md`;
	fs.writeFileSync(path.resolve(__dirname, filename), text);
	return filename;
}
let componentsTocFilename = generateTableOfContents(componentSectionTitle, components);
let demoTocFilename = generateTableOfContents(demoSectionTitle, demoPages.map(demoPage => demoPage.title));

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
	getComponentPathLine: componentPath => `import { ${path.basename(componentPath, '.js')} } from 'kokopu-react';`,
	getExampleFilename: componentPath => path.resolve(__dirname, `${docSrcDir}/examples/${path.basename(componentPath, '.js')}.md`),
	pagePerSection: true,
	sections: [
		{
			name: 'Home',
			content: `${docSrcDir}/home.md`,
		},
		{
			name: componentSectionTitle,
			content: componentsTocFilename,
			components: components.map(componentName => `${srcDir}/${componentName}.js`),
			sectionDepth: 1
		},
		{
			name: demoSectionTitle,
			content: demoTocFilename,
			sectionDepth: 1,
			sections: demoPages.map(demoPage => {
				return {
					name: demoPage.title,
					content: demoPage.filename,
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
