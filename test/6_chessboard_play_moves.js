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


const { openBrowser, closeBrowser, itCustom, setSandbox, compareSandbox, takeScreenshot, compareScreenshot } = require('./common/graphic');


describe('Chessboard play moves', function() {

	const browserContext = {};

	before(async function() {
		await openBrowser(this, browserContext);
	});

	after(async function() {
		await closeBrowser(browserContext);
	});

	function itCheckPlayMove(itemIndex, label, xFrom, yFrom, xTo, yTo, imageBaseName, expectedText) {
		itCustom(browserContext, '10_chessboard_play_moves', itemIndex, label, async function(element) {
			let actions = browserContext.driver.actions({ async: true });
			let area = await element.getRect();
			await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).perform();
			await takeScreenshot(browserContext, imageBaseName, element);
			await actions.release().perform();
			await compareScreenshot(browserContext, imageBaseName);
			await compareSandbox(browserContext, expectedText);
		});
	}

	itCheckPlayMove(0, 'regular move 1', 225, 335, 220, 225, 'regular_move_1', 'move played: e4');
	itCheckPlayMove(1, 'regular move 2', 275, 225, 135, 85, 'regular_move_2', 'move played: Bxf2+');
	itCheckPlayMove(1, 'castling move', 175, 375, 75, 375, 'castling_move', 'move played: O-O');

	function itCheckNonPlayMove(itemIndex, label, xFrom, yFrom, xTo, yTo, imageBaseName) {
		itCustom(browserContext, '10_chessboard_play_moves', itemIndex, label, async function(element) {
			await setSandbox(browserContext, imageBaseName); // can be any value as long as it is unique among other test-cases
			let actions = browserContext.driver.actions({ async: true });
			let area = await element.getRect();
			await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).perform();
			await takeScreenshot(browserContext, imageBaseName, element);
			await actions.release().perform();
			await compareScreenshot(browserContext, imageBaseName);
			await compareSandbox(browserContext, imageBaseName);
		});
	}

	itCheckNonPlayMove(2, 'illegal position', 225, 325, 225, 225, 'illegal_position');
	itCheckNonPlayMove(0, 'wrong color moved', 75, 25, 125, 125, 'wrong_color');
	itCheckNonPlayMove(0, 'illegal move', 75, 375, 125, 225, 'illegal_move');
	itCheckNonPlayMove(0, 'from == to', 75, 375, 85, 365, 'null_vector');
	itCheckNonPlayMove(0, 'out of board', 325, 375, 450, 285, 'out_of_board');
});
