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
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// List all the files corresponding to /test/graphic_test_app/{number}_*/*.tsx, each of them corresponding to a entry.
const items = fs.readdirSync('./test/graphic_test_app', { withFileTypes: true })
    .filter(file => file.isDirectory() && /^\d+_/.test(file.name))
    .flatMap(file => fs.readdirSync(`./test/graphic_test_app/${file.name}`)
        .filter(subFile => path.extname(subFile) === '.tsx')
        .map(subFile => `${file.name}/${path.basename(subFile, '.tsx')}`)
    );
const entries = {};
items.forEach(item => {
    entries[item] = `./test/graphic_test_app/${item}`;
});

// Define the outputs.
const plugins = items.map(item => new HtmlWebpackPlugin({
    title: 'Test ' + item,
    chunks: [ item ],
    filename: item + '/index.html',
}));
plugins.push(new CopyWebpackPlugin({
    patterns: [
        { from: './test/graphic_test_app/common/heartbeat.txt', to: 'heartbeat.txt' },
        { from: './test/graphic_test_app/common/smiley.png', to: 'smiley.png' },
    ],
}));

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: entries,
    output: {
        path: path.resolve(__dirname, '../build/test_graphic'),
        hashFunction: "xxhash64", // FIXME The default hash function used by Webpack has been removed from OpenSSL.
        clean: true,
    },
    plugins: plugins,
    module: {
        rules: [
            {
                test: /\.js$/i,
                use: 'coverage-istanbul-loader',
            },
            {
                test: /\.tsx?$/i,
                use: [
                    'coverage-istanbul-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(__dirname, 'test-graphic.tsconfig.json'),
                        },
                    },
                ],
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
                test: /\.pgn$/i,
                type: 'asset/source',
            },
        ],
    },
    resolve: {
        extensions: [ '.js', '.ts', '.tsx' ],
    },
};
