/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2022  Yoann Le Montagner <yo35 -at- melix.net>       *
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


import React from 'react';
import kokopu from 'kokopu';
import testApp from './common/test_app';
import { Movetext } from '../src/index';

import pgn from './common/games.pgn';
import dummyPgn from './common/dummy.pgn';

let database = kokopu.pgnRead(pgn);

testApp([ /* eslint-disable react/jsx-key */
	<Movetext game={database} gameIndex={99} />,
	<Movetext game={dummyPgn} />,
	<Movetext game={kokopu.pgnRead(dummyPgn)} gameIndex={1} />,
	<Movetext game={42} />,
], 'width-600'); /* eslint-enable react/jsx-key */
