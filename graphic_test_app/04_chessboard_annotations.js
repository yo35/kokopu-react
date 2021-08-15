/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021  Yoann Le Montagner <yo35 -at- melix.net>            *
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

let squareMarkers1 = 'Ga1,Ga2,Rb1,Rb2,Yc1,Yc2';
let arrowMarkers1 = 'Gb8c6,Re8f6,Yf8g6';
let textMarkers1 = 'GAf1,Gaf2,RZg1,Rzg2,Y2h1,Y8h2';

let squareMarkers2 = { e4: 'g', g5: 'r', g1: 'y' };
let arrowMarkers2 = { c3a2: 'y', c4a4: 'g', c5a6: 'r', c6a8: 'y', d6c8: 'g', e6e8: 'r', f6g8: 'y' };
let textMarkers2 = { g3: { symbol: 'H', color: 'r' }, g5: { symbol: 'M', color: 'g' } };

let squareMarkers3 = { b5: 'r', e4: 'g', h5: 'y' };
let arrowMarkers3 = { d1h5: 'g', a5f4: 'r', c7c3: 'y', g7g7: 'g' };
let textMarkers3 = 'G5c6';

testApp([ /* eslint-disable react/jsx-key */
	<Chessboard squareMarkers={squareMarkers1} arrowMarkers={arrowMarkers1} textMarkers={textMarkers1} flipped={false} coordinateVisible={true} />,
	<Chessboard squareMarkers={squareMarkers1} arrowMarkers={arrowMarkers1} textMarkers={textMarkers1} flipped={true} coordinateVisible={true} />,
	<Chessboard squareMarkers={squareMarkers2} arrowMarkers={arrowMarkers2} textMarkers={textMarkers2} flipped={false} coordinateVisible={false} />,
	<Chessboard squareMarkers={squareMarkers2} arrowMarkers={arrowMarkers2} textMarkers={textMarkers2} flipped={true} coordinateVisible={false} />,
	<Chessboard squareMarkers={squareMarkers3} arrowMarkers={arrowMarkers3} textMarkers={textMarkers3} flipped={false} coordinateVisible={false} position="empty" />,
	<Chessboard squareMarkers={squareMarkers3} arrowMarkers={arrowMarkers3} textMarkers={textMarkers3} flipped={true} coordinateVisible={true}
		position="8/8/1r6/8/5k1K/8/8/8 b - - 0 1" />,
]); /* eslint-enable react/jsx-key */
