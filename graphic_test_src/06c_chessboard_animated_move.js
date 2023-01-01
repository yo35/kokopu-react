/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2023  Yoann Le Montagner <yo35 -at- melix.net>       *
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
import testApp from './common/test_app';
import { Chessboard } from '../src/index';

window['__kokopu_debug_freeze_motion'] = 0.91;

testApp([ /* eslint-disable react/jsx-key */
	<Chessboard move="e4" animated={true} />,
	<Chessboard move="Nf3" animated={true} moveArrowVisible={false} />,
	<Chessboard position="r1bqkbnr/pppppppp/n7/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2" move="Bxa6" animated={true} flipped />,
	<Chessboard position="r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R b KQkq - 0 1" move="O-O-O" animated={true} />,
	<Chessboard position="rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3" move="exf6" animated={true} />,
	<Chessboard position="8/8/8/1K6/8/4k3/1p6/8 b - - 0 1" move="b1=R+" animated={true} />,
]); /* eslint-enable react/jsx-key */
