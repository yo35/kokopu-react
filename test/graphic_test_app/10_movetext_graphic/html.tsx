/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2025  Yoann Le Montagner <yo35 -at- melix.net>       *
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


import * as React from 'react';
import { testApp } from '../common/test_app';
import { Movetext } from '../../../dist/lib/index';

import pgn from '../common/games.pgn';

testApp([ /* eslint-disable react/jsx-key */
    <Movetext game={pgn} gameIndex={4} />,
    <Movetext game={pgn} gameIndex={5} />,
    <Movetext game={pgn} gameIndex={6} />,
], 'width-600'); /* eslint-enable react/jsx-key */

const customCSS = document.createElement('style');
customCSS.innerText = `
    .myClass { font-weight: bold; color: green; }
    #myId { font-weight: bold; color: red; }
`;
document.head.appendChild(customCSS);
