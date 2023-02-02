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
import { Chessboard } from '../dist/lib/index';

let pos1 = '2qb1rk1/3n1p1p/2p3p1/2Pp4/p2P1BQ1/8/P1N2PPP/R5K1 b - - 0 1';
let mv1 = 'Ba5';

let pos2 = 'start';
let mv2 = 'e4';

let sm = 'Ba8,Ba7,Gb8,Gb7,Rc8,Rc7,Yd8,Yd7';
let am = 'Ba1a3,Gb1b3,Rc1c3,Yd1d3';

testApp([ /* eslint-disable react/jsx-key */
	<Chessboard position={pos1} move={mv1} squareMarkers={sm} arrowMarkers={am} animated={false} />,
	<Chessboard position={pos2} move={mv2} squareMarkers={sm} arrowMarkers={am} squareSize={60} animated={false} />,
	<Chessboard position={pos1} move={mv1} squareMarkers={sm} arrowMarkers={am} squareSize={29} coordinateVisible={false} flipped={true} animated={false} />,
	<Chessboard position={pos1} move={mv1} squareMarkers={sm} arrowMarkers={am} squareSize={47} coordinateVisible={true} flipped={true} colorset="scid" animated={false} />,
	<Chessboard position={pos2} move={mv2} squareMarkers={sm} arrowMarkers={am} coordinateVisible={false} colorset="marine" pieceset="eyes" animated={false} />,
	<Chessboard position={pos1} move={mv1} squareMarkers={sm} arrowMarkers={am} coordinateVisible={false} pieceset="fantasy" animated={false} />,
	<Chessboard position={pos1} move={mv1} squareMarkers={sm} arrowMarkers={am} colorset="emerald" pieceset="skulls" animated={false} />,
	<Chessboard position={pos2} move={mv2} squareMarkers={sm} arrowMarkers={am} squareSize={91} flipped={true} colorset="gray" pieceset="spatial" animated={false} />,
	<Chessboard position={pos1} move={mv1} squareMarkers={sm} arrowMarkers={am} squareSize={17} colorset="dusk" animated={false} />,
]); /* eslint-enable react/jsx-key */
