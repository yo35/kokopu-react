/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2024  Yoann Le Montagner <yo35 -at- melix.net>       *
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
import { Game } from 'kokopu';
import { testApp } from '../common/test_app';
import { NavigationBoard } from '../../../dist/lib/index';

const game = new Game();
game.mainVariation().play('e4');

testApp([ /* eslint-disable react/jsx-key */
	<NavigationBoard game={game} initialNodeId="end" squareSize={20} coordinateVisible={false} />,
	<NavigationBoard game={game} initialNodeId="end" squareSize={53} colorset="scid" pieceset="celtic" flipButtonVisible={false} />,
	<NavigationBoard game={game} initialNodeId="end" turnVisible={false} moveArrowColor="g" />,
	<div style={{ color: 'red' }}><NavigationBoard game={game} initialNodeId="end" squareSize={48} moveArrowVisible={false} /></div>,
]); /* eslint-enable react/jsx-key */
