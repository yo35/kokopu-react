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


import * as React from 'react';
import { Game, Position, pgnRead } from 'kokopu';
import { setSandbox, testApp } from '../common/test_app';
import { NavigationBoard } from '../../../dist/lib/index';

import pgn from '../common/games.pgn';

const game = new Game();
game.initialPosition(new Position('regular', 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4'), 4);
game.mainVariation().play('Qxf7#');
game.result('1-0');

const gameWithNullMove = new Game();
gameWithNullMove.mainVariation().play('e4').play('e5').play('Nf3').play('--').play('Bc4');

const database = pgnRead(pgn);

function onNodeIdChanged(nodeId: string) { // Must NOT be invoked as the components are uncontrolled.
    setSandbox(`Node ID changed: ${nodeId}`);
}

function onFlippedChanged(flipped: boolean) {
    setSandbox(`Flip state changed: ${flipped}`);
}

testApp([ /* eslint-disable react/jsx-key */
    <NavigationBoard game={game} initialFlipped />,
    <NavigationBoard game={pgn} initialNodeId="end" initialFlipped flipped={false} />,
    <NavigationBoard game={pgn} gameIndex={1} initialNodeId="17w" onNodeIdChanged={onNodeIdChanged} />,
    <NavigationBoard game={database} gameIndex={3} onNodeIdChanged={onNodeIdChanged} flipped onFlippedChanged={onFlippedChanged} />,
    <NavigationBoard game={gameWithNullMove} initialNodeId="2b" />,
]); /* eslint-enable react/jsx-key */
