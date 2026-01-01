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


const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        index: './dist/lib/index',
    },
    output: {
        path: path.resolve(__dirname, '../build/test_headless'),
        library: {
            type: 'commonjs2',
        },
        hashFunction: "xxhash64", // FIXME The default hash function used by Webpack has been removed from OpenSSL.
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                use: 'coverage-istanbul-loader',
            },
            {
                test: /\.css$/i,
                use: 'null-loader',
            },
            {
                test: /\.(png|woff|woff2)$/i,
                use: 'null-loader',
            },
        ],
    },
};
