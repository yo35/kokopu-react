/* -------------------------------------------------------------------------- *
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2024  Yoann Le Montagner <yo35 -at- melix.net>       *
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
 * -------------------------------------------------------------------------- */


import * as React from 'react';
import { Game, pgnRead } from 'kokopu';
import { testApp } from '../common/test_app';
import { Movetext } from '../../../dist/lib/index';

import pgn from '../common/games.pgn';

const game = new Game();
game.mainVariation().play('e4').play('e5').play('Bc4').play('Nc6').play('Qh5').play('Nf6').play('Qxf7#');
game.result('1-0');

const database = pgnRead(pgn);

testApp([ /* eslint-disable react/jsx-key */
	<Movetext game={game} />,
	<Movetext game={database} />,
	<Movetext game={pgn} gameIndex={1} />,
	<Movetext game={database} gameIndex={3} />,
], 'width-600'); /* eslint-enable react/jsx-key */
