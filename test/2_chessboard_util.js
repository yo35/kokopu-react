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


const { Chessboard } = require('../build/test_headless/index');
const test = require('unit.js');


function testAdaptSquareSize(expectedSquareSize, width, height, coordinateVisible, smallScreenLimits) {
	test.value(Chessboard.adaptSquareSize(width, height, coordinateVisible, smallScreenLimits)).is(expectedSquareSize);

	const actualSize = Chessboard.size(expectedSquareSize, coordinateVisible, smallScreenLimits);
	test.value(actualSize.width <= width && actualSize.height <= height).isTrue();
}

function testAdaptSquareSizeWithIncrement(expectedSquareSize, width, height, coordinateVisible, smallScreenLimits) {
	testAdaptSquareSize(expectedSquareSize, width, height, coordinateVisible, smallScreenLimits);

	const actualSizeIncremented = Chessboard.size(expectedSquareSize + 1, coordinateVisible, smallScreenLimits);
	test.value(actualSizeIncremented.width > width || actualSizeIncremented.height > height).isTrue();
}

describe('Adapt square-size', () => {

	it('Very small', () => { test.value(Chessboard.adaptSquareSize(10, 10, false)).is(Chessboard.minSquareSize()); });
	it('Very large', () => { test.value(Chessboard.adaptSquareSize(9999, 9999, true)).is(Chessboard.maxSquareSize()); });

	it('Size 185x300 with coordinates', () => testAdaptSquareSizeWithIncrement(19, 185, 300, true));
	it('Size 185x300 without coordinates', () => testAdaptSquareSizeWithIncrement(20, 185, 300, false));
	it('Size 300x200 with coordinates', () => testAdaptSquareSizeWithIncrement(23, 300, 200, true));
	it('Size 300x200 without coordinates', () => testAdaptSquareSizeWithIncrement(25, 300, 200, false));
	it('Size 375x500 with coordinates', () => testAdaptSquareSizeWithIncrement(40, 375, 500, true));
	it('Size 375x500 without coordinates', () => testAdaptSquareSizeWithIncrement(41, 375, 500, false));
	it('Size 600x450 with coordinates', () => testAdaptSquareSizeWithIncrement(54, 600, 450, true));
	it('Size 600x450 without coordinates', () => testAdaptSquareSizeWithIncrement(56, 600, 450, false));
});

describe('Adapt square-size with small-screen limits', () => {

	const limits = [
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
		testAdaptSquareSize(32, 9999, 9999, true, limits);
	});
	it('Available-space-limited 1', () => {
		window.innerWidth = 800;
		testAdaptSquareSize(40, 375, 500, true, limits);
	});
	it('Available-space-limited 2', () => {
		window.innerWidth = 800;
		testAdaptSquareSize(41, 375, 500, false, limits);
	});
	it('Force hidden coordinates', () => {
		window.innerWidth = 600;
		testAdaptSquareSize(20, 185, 300, true, limits);
	});
});
