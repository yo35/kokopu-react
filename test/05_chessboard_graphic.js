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


const { describeWithBrowser, itChecksScreenshots } = require('./common/graphic');


describeWithBrowser('Chessboard graphic', browserContext => {

	itChecksScreenshots(browserContext, '04_chessboard_simple', [
		'default',
		'empty',
		'parsing error',
		'from FEN',
		'from Kokopu object',
		'wrong type',
	]);

	itChecksScreenshots(browserContext, '05_chessboard_flipped', [
		'default',
		'empty',
		'parsing error',
		'from FEN',
		'from Kokopu object',
	]);

	itChecksScreenshots(browserContext, '06_chessboard_annotations', [
		'with coordinates',
		'with coordinates and flip',
		'without coordinates',
		'without coordinates and flip',
		'overlap',
		'overlap and flip',
	]);

	itChecksScreenshots(browserContext, '07_chessboard_move', [
		'default',
		'no move arrow',
		'parsing error',
		'with forced move arrow and flip',
		'capture',
		'castling move',
		'en-passant',
		'promotion',
		'wrong type',
	]);

	itChecksScreenshots(browserContext, '08_chessboard_theme', [
		'default',
		'large',
		'small',
		'custom 1',
		'custom 2',
		'custom 3',
		'custom 4',
		'custom 5',
		'custom 6',
	]);

});
