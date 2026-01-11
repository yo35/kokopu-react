/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2026  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    Kokopu-React is free software: you can redistribute it and/or           *
 *    modify it under the terms of the GNU Lesser General Public License      *
 *    as published by the Free Software Foundation, either version 3 of       *
 *    the License, or (at your option) any later version.                     *
 *                                                                            *
 *    Kokopu-React is distributed in the hope that it will be useful,         *
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of          *
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the            *
 *    GNU Lesser General Public License for more details.                     *
 *                                                                            *
 *    You should have received a copy of the GNU Lesser General               *
 *    Public License along with this program. If not, see                     *
 *    <http://www.gnu.org/licenses/>.                                         *
 *                                                                            *
 * -------------------------------------------------------------------------- */


const fs = require('fs');
const path = require('path');
const version = require('../package.json').version;

const reactDocgenTypescript = require('react-docgen-typescript');

const docSrcDir = '../doc_src';
const srcDir = '../src';
const tmpDir = '../build/tmp_docs';

fs.mkdirSync(path.resolve(__dirname, tmpDir), { recursive: true });


// Component section configuration
// -------------------------------

const componentSectionTitle = 'Components';
const components = [
    'errorbox/ErrorBox',
    'icons/SquareMarkerIcon',
    'icons/TextMarkerIcon',
    'icons/ArrowMarkerIcon',
    'icons/ChessPieceIcon',
    'chessboard/Chessboard',
    'navigationboard/NavigationBoard',
    'movetext/Movetext',
];


// Demo section configuration
// --------------------------

const demoSectionTitle = 'Live demo';
const demoPages = [
    { id: 'ChessboardBase', title: 'Chessboard - Basic features' },
    { id: 'ChessboardInteraction', title: 'Chessboard - Interactions' },
    { id: 'ChessboardMove', title: 'Chessboard - Display moves' },
    { id: 'ChessboardSmallScreens', title: 'Chessboard - Small screens' },
    { id: 'NavigationBoardBase', title: 'NavigationBoard - Basic features' },
    { id: 'NavigationBoardUncontrolledVsControlled', title: 'NavigationBoard - Uncontrolled vs. controlled' },
    { id: 'MovetextBase', title: 'Movetext - Basic features' },
    { id: 'MovetextInteraction', title: 'Movetext - Interactions' },
    { id: 'SynchroNavigationBoardMovetext', title: 'Synchronize NavigationBoard and Movetext components' },
];


// Build the documentation
// -----------------------

// Generate the Markdown file corresponding to each demo page.
demoPages.forEach(demoPage => {
    fs.writeFileSync(path.resolve(__dirname, `${tmpDir}/${demoPage.id}.md`),
        '```js\n' +
        `<Page${demoPage.id} />\n` +
        '```\n'
    );
});

// Generate the changelog page.
const changelog = fs.readFileSync(path.resolve(__dirname, '../CHANGELOG.md'), { encoding: 'utf8' }).split('\n').slice(2);
changelog.unshift('<div id="changelog">');
changelog.push('</div>');
fs.writeFileSync(path.resolve(__dirname, `${tmpDir}/changelog.md`), changelog.join('\n'));

// Generate the table of contents for each sections with sub-sections.
function generateTableOfContents(parentName, itemNames) {
    const text = itemNames.map(itemName => {
        itemName = path.basename(itemName);
        const link = `#/${parentName}/${itemName}`.replace(/ /g, '%20');
        return `- [${itemName}](${link})\n`;
    }).join('');
    const filename = `${tmpDir}/Header_${parentName.replace(/ /g, '_')}.md`;
    fs.writeFileSync(path.resolve(__dirname, filename), text);
    return filename;
}
const componentsTocFilename = generateTableOfContents(componentSectionTitle, components);
const demoTocFilename = generateTableOfContents(demoSectionTitle, demoPages.map(demoPage => demoPage.title));

// Define the symbols available for example blocks in documentation.
const componentContext = Object.fromEntries(components.map(componentName => [ path.basename(componentName), path.resolve(__dirname, `${srcDir}/${componentName}`) ]));
const demoContext = Object.fromEntries(demoPages.map(demoPage => [ 'Page' + demoPage.id, path.resolve(__dirname, `${docSrcDir}/demo/Page${demoPage.id}`) ]));


// Styleguidist config.
module.exports = {
    styleguideDir: '../dist/docs',
    webpackConfig: {
        module: {
            rules: [
                {
                    test: /\.js$/i,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [ '@babel/preset-env', '@babel/preset-react' ],
                        },
                    }
                },
                {
                    test: /\.tsx?$/i,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(__dirname, 'doc.tsconfig.json'),
                        },
                    },
                },
                {
                    test: /\.css$/i,
                    use: [ 'style-loader', 'css-loader' ],
                },
                {
                    test: /\.(ogg|png|woff|woff2)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(pgn|txt)$/i,
                    type: 'asset/source',
                },
            ],
        },
        resolve: {
            extensions: [ '*.js', '*.ts', '*.tsx' ],
        },
    },
    propsParser: (filePath, source, resolver, handlers) => reactDocgenTypescript.parse(filePath, source, resolver, handlers),
    usageMode: 'expand',
    exampleMode: 'expand',
    context: Object.assign({}, componentContext, demoContext),
    getComponentPathLine: componentPath => `import { ${path.basename(componentPath, '.tsx')} } from 'kokopu-react';`,
    getExampleFilename: componentPath => path.resolve(__dirname, `${docSrcDir}/examples/${path.basename(componentPath, '.tsx')}.md`),
    pagePerSection: true,
    sections: [
        {
            name: 'Home',
            content: `${docSrcDir}/home.md`,
        },
        {
            name: componentSectionTitle,
            content: componentsTocFilename,
            components: components.map(componentName => `${srcDir}/${componentName}.tsx`),
            sectionDepth: 1,
        },
        {
            name: demoSectionTitle,
            content: demoTocFilename,
            sectionDepth: 1,
            sections: demoPages.map(demoPage => {
                return {
                    name: demoPage.title,
                    content: `${tmpDir}/${demoPage.id}.md`,
                    exampleMode: 'hide',
                };
            }),
        },
        {
            name: 'Webpack configuration',
            content: `${docSrcDir}/webpack_configuration.md`,
        },
        {
            name: 'Kokopu core library documentation',
            href: 'https://kokopu.yo35.org/',
        },
        {
            name: 'ChangeLog',
            content: `${tmpDir}/changelog.md`,
        },
        {
            name: 'Migrate to 2.x',
            content: `${docSrcDir}/migrate_to_2.md`,
        },
        {
            name: 'Migrate to 3.x',
            content: `${docSrcDir}/migrate_to_3.md`,
        },
    ],
    styleguideComponents: {
        LogoRenderer: path.resolve(__dirname, `${docSrcDir}/theming/LogoRenderer`),
    },
    template: {
        favicon: 'kokopu-react-favicon.png',
    },
    theme: {
        sidebarWidth: 300,
    },
    title: 'Kokopu-React documentation',
    version: version,
};
