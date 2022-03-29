/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2022  Yoann Le Montagner <yo35 -at- melix.net>       *
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
import { Movetext, i18n } from '../src/index';

import pgn from './common/games.pgn';

let legacyPieceSymbols = i18n.PIECE_SYMBOLS;

// Localization for French
i18n.PIECE_SYMBOLS = { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C', P: 'P' };

testApp([ /* eslint-disable react/jsx-key */
	<Movetext game={pgn} pieceSymbols="localized" />,
	<Movetext game={pgn} gameIndex={2} pieceSymbols={{ K: 'Ki_', Q: 'Qu_', R: 'Rk_', B: 'Bi_', N: 'Kn_', P: 'Pw_' }} />,
	<Movetext game={pgn} gameIndex={3} pieceSymbols="figurines"
		diagramOptions={{ flipped: true, coordinateVisible: false, squareSize: 32, colorset: 'scid', pieceset: 'eyes' }} />,
], 'width-600'); /* eslint-enable react/jsx-key */

i18n.PIECE_SYMBOLS = legacyPieceSymbols;
