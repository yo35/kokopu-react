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


/**
 * This module defines the localizable strings used by the library.
 */
export namespace i18n {

/* eslint-disable prefer-const, @stylistic/indent */
// WARNING: all those constants must be declared with "let" to allow them to be re-defined if necessary by consumer codes.

// Error box
export let LINE = 'line {0}';

// Chessboard
export let INVALID_FEN_ERROR_TITLE = 'Invalid FEN string.';
export let INVALID_NOTATION_ERROR_TITLE = 'Invalid move notation.';

// Navigation board
export let TOOLTIP_GO_FIRST = 'Go to the beginning of the game';
export let TOOLTIP_GO_PREVIOUS = 'Go to the previous move';
export let TOOLTIP_GO_NEXT = 'Go to the next move';
export let TOOLTIP_GO_LAST = 'Go to the end of the game';
export let TOOLTIP_PLAY_STOP = 'Play/stop the game';
export let TOOLTIP_FLIP = 'Flip the board';

// Movetext
export let PIECE_SYMBOLS = { K: 'K', Q: 'Q', R: 'R', B: 'B', N: 'N', P: 'P' };
export let ANNOTATED_BY = 'Annotated by {0}';
export let INVALID_PGN_ERROR_TITLE = 'Invalid PGN string.';

}
