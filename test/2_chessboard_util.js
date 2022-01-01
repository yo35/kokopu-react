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


let { Chessboard } = require('../build/test_headless/index');
let test = require('unit.js');


describe('Adapt square-size', () => {

	it('Very small', () => { test.value(Chessboard.adaptSquareSize(10, 10, false)).is(Chessboard.minSquareSize()); });
	it('Very large', () => { test.value(Chessboard.adaptSquareSize(9999, 9999, true)).is(Chessboard.maxSquareSize()); });

	it('Size 185x300 with coordinates', () => { test.value(Chessboard.adaptSquareSize(185, 300, true)).is(19); });
	it('Size 185x300 without coordinates', () => { test.value(Chessboard.adaptSquareSize(185, 300, false)).is(20); });
	it('Size 300x200 with coordinates', () => { test.value(Chessboard.adaptSquareSize(300, 200, true)).is(23); });
	it('Size 300x200 without coordinates', () => { test.value(Chessboard.adaptSquareSize(300, 200, false)).is(25); });
	it('Size 375x500 with coordinates', () => { test.value(Chessboard.adaptSquareSize(375, 500, true)).is(40); });
	it('Size 375x500 without coordinates', () => { test.value(Chessboard.adaptSquareSize(375, 500, false)).is(41); });
	it('Size 600x450 with coordinates', () => { test.value(Chessboard.adaptSquareSize(600, 450, true)).is(54); });
	it('Size 600x450 without coordinates', () => { test.value(Chessboard.adaptSquareSize(600, 450, false)).is(56); });
});

describe('Adapt square-size with small-screen limits', () => {

	let limits = [
		{ width: 470, squareSize: 12, coordinateVisible: false },
		{ width: 540, squareSize: 16, coordinateVisible: false },
		{ width: 620, squareSize: 24, coordinateVisible: false },
		{ width: 730, squareSize: 32 },
		{ width: 860, squareSize: 44 },
	];

	before(() => {
		global.window = {};
	});
	after(() => {
		delete global.window;
	});

	it('Window-limited', () => {
		window.innerWidth = 640;
		test.value(Chessboard.adaptSquareSize(9999, 9999, true, limits)).is(32);
	});
	it('Available-space-limited 1', () => {
		window.innerWidth = 800;
		test.value(Chessboard.adaptSquareSize(375, 500, true, limits)).is(40);
	});
	it('Available-space-limited 2', () => {
		window.innerWidth = 800;
		test.value(Chessboard.adaptSquareSize(375, 500, false, limits)).is(41);
	});
	it('Force hidden coordinates', () => {
		window.innerWidth = 600;
		test.value(Chessboard.adaptSquareSize(185, 300, true, limits)).is(20);
	});
});
