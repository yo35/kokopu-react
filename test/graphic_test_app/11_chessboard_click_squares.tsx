/* -------------------------------------------------------------------------- *
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
 * -------------------------------------------------------------------------- */


import * as React from 'react';
import { Square } from 'kokopu';
import { testApp, setSandbox } from './common/test_app';
import { Chessboard } from '../../dist/lib/index';

function onSquareClicked(sq: Square) {
	setSandbox(`square clicked: ${sq}`);
}

testApp([ /* eslint-disable react/jsx-key */
	<Chessboard squareSize={50} interactionMode="clickSquares" onSquareClicked={onSquareClicked} />,
	<Chessboard squareSize={50} interactionMode="clickSquares" onSquareClicked={onSquareClicked} flipped coordinateVisible={false} />,
	<Chessboard squareSize={50} interactionMode="clickSquares" onSquareClicked={onSquareClicked} position="empty"
		squareMarkers="Ga8" arrowMarkers="Ra6d6" textMarkers="YAb4" />,
]); /* eslint-enable react/jsx-key */
