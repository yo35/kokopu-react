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
import { Square } from 'kokopu';
import { testApp, setSandbox } from '../common/test_app';
import { Chessboard } from '../../../dist/lib/index';

function onPieceMoved(from: Square, to: Square) {
    setSandbox(`piece moved: ${from} -> ${to}`);
}

testApp([ /* eslint-disable react/jsx-key */
    <Chessboard squareSize={50} coordinateVisible={false} interactionMode="movePieces" onPieceMoved={onPieceMoved} />,
    <Chessboard
        squareSize={50} coordinateVisible={false} interactionMode="movePieces" onPieceMoved={onPieceMoved} flipped
        squareMarkers="Gc4" textMarkers="BAh3" arrowMarkers="Gc8a4" moveArrowColor="r"
    />,
    <Chessboard squareSize={50} coordinateVisible={false} interactionMode="movePieces" onPieceMoved={onPieceMoved} move="e4" animated={false} />,
]); /* eslint-enable react/jsx-key */
