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
import { Position } from 'kokopu';
import { testApp } from '../common/test_app';
import { Chessboard } from '../../../dist/lib/index';

const pos = new Position('r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4');
const move = pos.notation('Bxc6');

testApp([ /* eslint-disable react/jsx-key */
	<Chessboard move="e4" animated={false} />,
	<Chessboard move="Nf3" moveArrowVisible={false} animated={false} />,
	<Chessboard move="Nf4" animated={false} />,
	<Chessboard position="rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2" move="Bb4+" moveArrowVisible={true} flipped={true} animated={true} />,
	<Chessboard position={pos} move={move} animated={true} moveArrowColor="g" />,
	<Chessboard position="r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R b KQkq - 0 1" move="O-O-O" animated={false} moveArrowColor="r" />,
	<Chessboard position="rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3" move="exf6" animated={false} moveArrowColor="y" />,
	<Chessboard position="8/8/8/1K6/8/4k3/1p6/8 b - - 0 1" move="b1=R+" animated={false} moveArrowColor="b" />,
	<Chessboard move={ /* eslint-disable @typescript-eslint/no-explicit-any */ 42 as any /* eslint-enable @typescript-eslint/no-explicit-any */ } animated={false} />,
	<Chessboard move="e4" animated={false} moveArrowColor={ /* eslint-disable @typescript-eslint/no-explicit-any */ 'z' as any /* eslint-enable @typescript-eslint/no-explicit-any */ } />,
	<Chessboard move="--" animated={false} />,
	<Chessboard position="rnbqkbnr/ppp1pppp/8/1B1p4/4P3/8/PPPP1PPP/RNBQK1NR b KQkq - 1 2" move="--" animated={false} />,
]); /* eslint-enable react/jsx-key */
