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
import { pgnRead } from 'kokopu';
import { testApp } from '../common/test_app';
import { Movetext } from '../../../dist/lib/index';

import pgn from '../common/games.pgn';
import dummyPgn from '../common/dummy.pgn';

const database = pgnRead(pgn);

testApp([ /* eslint-disable react/jsx-key */
    <Movetext game={pgn} gameIndex={99} />,
    <Movetext game={database} gameIndex={99} />,
    <Movetext game={dummyPgn} />,
    <Movetext game={pgnRead(dummyPgn)} gameIndex={1} />,
    <Movetext game={/* eslint-disable @typescript-eslint/no-explicit-any */ 42 as any /* eslint-enable @typescript-eslint/no-explicit-any */} />,
    <Movetext game={pgn} gameIndex={-1} />,
], 'width-600'); /* eslint-enable react/jsx-key */
