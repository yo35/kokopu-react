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
import testApp, { setSandbox } from './common/test_app';
import { Chessboard } from '../src/index';

function onMovePlayed(move) {
	setSandbox(`promotion move played: ${move}`);
}

testApp([ /* eslint-disable react/jsx-key */
	<Chessboard squareSize={50} coordinateVisible={false} interactionMode="playMoves" onMovePlayed={onMovePlayed} position="8/1P6/8/8/7k/8/5K2/8 w - - 0 1" />,
	<Chessboard squareSize={50} coordinateVisible={false} interactionMode="playMoves" onMovePlayed={onMovePlayed} position="8/8/8/8/7k/8/1p3K2/R7 b - - 0 1" />,
	<Chessboard squareSize={50} coordinateVisible={false} interactionMode="playMoves" onMovePlayed={onMovePlayed} flipped position="antichess:8/1P6/8/8/7r/8/5K2/8 w - - 0 1" />,
]); /* eslint-enable react/jsx-key */
