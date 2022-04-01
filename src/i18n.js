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


const i18n = {

	// Error box
	LINE: 'line {0}',

	// Chessboard
	INVALID_FEN_ERROR_TITLE: 'Invalid FEN string.',
	INVALID_NOTATION_ERROR_TITLE: 'Invalid move notation.',
	INVALID_POSITION_ATTRIBUTE_ERROR_MESSAGE: 'Invalid "position" attribute.',
	INVALID_MOVE_ATTRIBUTE_ERROR_MESSAGE: 'Invalid "move" attribute.',

	// Movetext
	PIECE_SYMBOLS: { 'K':'K', 'Q':'Q', 'R':'R', 'B':'B', 'N':'N', 'P':'P' },
	ANNOTATED_BY: 'Annotated by {0}',
	INVALID_PGN_ERROR_TITLE: 'Invalid PGN string.',
	INVALID_GAME_ATTRIBUTE_ERROR_MESSAGE: 'Invalid "game" attribute.',
};

export default i18n;
