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
import { testApp } from './common/test_app';
import { Chessboard, AnnotationColor, AnnotationSymbol } from '../../dist/lib/index';

const squareMarkers1 = 'Ba1,Ba2,Gb1,Gb2,Rc1,Rc2,Yd1,Yd2';
const arrowMarkers1 = 'Ba8b6,Gb8c6,Re8f6,Yf8g6';
const textMarkers1 = 'B(circle)e1,B(plus)e2,GAf1,Gaf2,RZg1,Rzg2,Y2h1,Y8h2';

const B: AnnotationColor = 'b';
const G: AnnotationColor = 'g';
const R: AnnotationColor = 'r';
const Y: AnnotationColor = 'y';

const SYMBOL_H: AnnotationSymbol = 'H';
const SYMBOL_M: AnnotationSymbol = 'M';
const SYMBOL_TIMES: AnnotationSymbol = 'times';

const squareMarkers2 = { e4: G, g5: R, g1: Y, h4: B };
const arrowMarkers2 = { c3a2: B, c4a4: G, c5a6: R, c6a8: Y, d6c8: B, e6e8: G, f6g8: R };
const textMarkers2 = { g3: { symbol: SYMBOL_H, color: R }, g5: { symbol: SYMBOL_M, color: G }, h4: { symbol: SYMBOL_TIMES, color: Y } };

const squareMarkers3 = { b5: R, e4: G, h5: Y, e2: B };
const arrowMarkers3 = { d1h5: G, a5f4: R, c7c3: Y, g7g7: G };
const textMarkers3 = 'G5c6,R(plus)a1,G(times)b1,B(dot)a2,Y(circle)b2';

testApp([ /* eslint-disable react/jsx-key */
	<Chessboard squareMarkers={squareMarkers1} arrowMarkers={arrowMarkers1} textMarkers={textMarkers1} flipped={false} coordinateVisible={true} />,
	<Chessboard squareMarkers={squareMarkers1} arrowMarkers={arrowMarkers1} textMarkers={textMarkers1} flipped={true} coordinateVisible={true} />,
	<Chessboard squareMarkers={squareMarkers2} arrowMarkers={arrowMarkers2} textMarkers={textMarkers2} flipped={false} coordinateVisible={false} />,
	<Chessboard squareMarkers={squareMarkers2} arrowMarkers={arrowMarkers2} textMarkers={textMarkers2} flipped={true} coordinateVisible={false} />,
	<Chessboard squareMarkers={squareMarkers3} arrowMarkers={arrowMarkers3} textMarkers={textMarkers3} flipped={false} coordinateVisible={false} position="empty" />,
	<Chessboard squareMarkers={squareMarkers3} arrowMarkers={arrowMarkers3} textMarkers={textMarkers3} flipped={true} coordinateVisible={true}
		position="8/8/1r6/8/5k1K/8/8/8 b - - 0 1" />,
]); /* eslint-enable react/jsx-key */
