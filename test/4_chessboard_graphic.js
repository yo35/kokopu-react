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


const { openBrowser, closeBrowser, itChecksScreenshots } = require('./common/graphic');


describe('Chessboard graphic', () => {

	const browserContext = {};

	before(async function() {
		await openBrowser(this, browserContext);
	});

	after(async () => {
		await closeBrowser(browserContext);
	});

	itChecksScreenshots(browserContext, '02_chessboard_simple', [
		'default',
		'empty',
		'invalid',
		'from FEN',
		'from Kokopu object',
		'wrong type',
	]);
	itChecksScreenshots(browserContext, '03_chessboard_flipped', [
		'default',
		'empty',
		'invalid',
		'from FEN',
		'from Kokopu object',
	]);
	itChecksScreenshots(browserContext, '04_chessboard_annotations', [
		'with coordinates',
		'with coordinates & flip',
		'without coordinates',
		'without coordinates & flip',
		'overlap',
		'overlap & flip',
	]);
	itChecksScreenshots(browserContext, '05_chessboard_move', [
		'default',
		'no move arrow',
		'invalid',
		'with forced move arrow & flip',
		'capture',
		'castling move',
		'en-passant',
		'promotion',
		'wrong type',
	]);
	itChecksScreenshots(browserContext, '06a_chessboard_animated_move', [
		'move 1',
		'move 2',
		'capture',
		'castling move',
		'en-pssant',
		'promotion',
	]);
	itChecksScreenshots(browserContext, '06b_chessboard_animated_move', [
		'move 1',
		'move 2',
		'capture',
		'castling move',
		'en-pssant',
		'promotion',
	]);
	itChecksScreenshots(browserContext, '06c_chessboard_animated_move', [
		'move 1',
		'move 2',
		'capture',
		'castling move',
		'en-pssant',
		'promotion',
	]);
	itChecksScreenshots(browserContext, '07_chessboard_theme', [
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
