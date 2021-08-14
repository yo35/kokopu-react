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


const { openBrowser, closeBrowser, itCustom, setSandbox, getSandboxAndCompare, takeScreenshotAndCompare } = require('./common/graphic');


describe('Chessboard interaction', function() {

	const browserContext = {};

	before(async function() {
		await openBrowser(this, browserContext);
	});

	after(async function() {
		await closeBrowser(browserContext);
	});

	function itCheckClickSquare(itemIndex, label, targets) {
		itCustom(browserContext, '07_chessboard_click_squares', itemIndex, label, async function(element) {
			let actions = browserContext.driver.actions({ async: true });
			let area = await element.getRect();
			for (let i = 0; i < targets.length; ++i) {
				let target = targets[i];
				await actions.move({ x: area.x + target.x, y: area.y + target.y }).click().perform();
				await getSandboxAndCompare(browserContext, target.expectedText);
			}
		});
	}

	itCheckClickSquare(0, 'default', [
		{ x: 225, y: 75, expectedText: 'square clicked: e7' },
		{ x: 25, y: 375, expectedText: 'square clicked: a1' },
		{ x: 325, y: 175, expectedText: 'square clicked: g5' },
	]);
	itCheckClickSquare(1, 'with flip', [
		{ x: 325, y: 175, expectedText: 'square clicked: b4' },
	]);
	itCheckClickSquare(2, 'over annotations', [
		{ x: 25, y: 25, expectedText: 'square clicked: a8' },
		{ x: 75, y: 125, expectedText: 'square clicked: b6' },
		{ x: 175, y: 125, expectedText: 'square clicked: d6' },
		{ x: 75, y: 225, expectedText: 'square clicked: b4' },
	]);

	function itCheckMovePiece(itemIndex, label, xFrom, yFrom, xTo, yTo, imageBaseName, expectedText) {
		itCustom(browserContext, '08_chessboard_move_pieces', itemIndex, label, async function(element) {
			let actions = browserContext.driver.actions({ async: true });
			let area = await element.getRect();
			await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).perform();
			await takeScreenshotAndCompare(browserContext, imageBaseName, element);
			await actions.release().perform();
			await getSandboxAndCompare(browserContext, expectedText);
		});
	}

	itCheckMovePiece(0, 'over empty', 275, 385, 225, 175, 'over_empty', 'piece moved: f1 -> e5');
	itCheckMovePiece(0, 'over non-empty 1', 280, 365, 75, 75, 'over_non_empty_1', 'piece moved: f1 -> b7');
	itCheckMovePiece(0, 'over non-empty 2', 130, 75, 225, 375, 'over_non_empty_2', 'piece moved: c7 -> e1');
	itCheckMovePiece(1, 'over square marker', 10, 325, 275, 175, 'over_square_marker', 'piece moved: h7 -> c4');
	itCheckMovePiece(1, 'over text marker', 225, 25, -100, 135, 'over_text_marker', 'piece moved: d1 -> h3');
	itCheckMovePiece(1, 'over arrow marker', 325, 25, 315, 260, 'over_arrow_marker', 'piece moved: b1 -> b6');
	itCheckMovePiece(2, 'after move', 225, 225, 75, 260, 'after_move', 'piece moved: e4 -> b3');

	function itCheckNonMovePiece(itemIndex, label, xFrom, yFrom, xTo, yTo, imageBaseName) {
		itCustom(browserContext, '08_chessboard_move_pieces', itemIndex, label, async function(element) {
			await setSandbox(browserContext, imageBaseName); // can be any value as long as it is unique among other test-cases
			let actions = browserContext.driver.actions({ async: true });
			let area = await element.getRect();
			await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).perform();
			await takeScreenshotAndCompare(browserContext, imageBaseName, element);
			await actions.release().perform();
			await getSandboxAndCompare(browserContext, imageBaseName);
		});
	}

	itCheckNonMovePiece(0, 'from == to', 75, 375, 80, 360, 'empty_move');
	itCheckNonMovePiece(0, 'move empty square', 175, 225, 275, 75, 'empty_square');

	function itCheckEditArrow(itemIndex, label, xFrom, yFrom, xTo, yTo, imageBaseName, expectedText) {
		itCustom(browserContext, '09_chessboard_edit_arrows', itemIndex, label, async function(element) {
			let actions = browserContext.driver.actions({ async: true });
			let area = await element.getRect();
			await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).perform();
			await takeScreenshotAndCompare(browserContext, imageBaseName, element);
			await actions.release().perform();
			await getSandboxAndCompare(browserContext, expectedText);
		});
	}

	itCheckEditArrow(0, 'base 1', 325, 275, 110, 140, 'base_1', 'arrow edited: g3 -> c6');
	itCheckEditArrow(0, 'base 2', 260, 10, 175, 375, 'base_2', 'arrow edited: f8 -> d1');
	itCheckEditArrow(1, 'over square marker', 275, 125, 275, 230, 'over_square_marker', 'arrow edited: c3 -> c5');
	itCheckEditArrow(1, 'over arrow marker', 40, 110, 125, 290, 'over_arrow_marker', 'arrow edited: h3 -> f6');

	function itCheckNonEditArrow(itemIndex, label, xFrom, yFrom, xTo, yTo, imageBaseName) {
		itCustom(browserContext, '09_chessboard_edit_arrows', itemIndex, label, async function(element) {
			await setSandbox(browserContext, imageBaseName); // can be any value as long as it is unique among other test-cases
			let actions = browserContext.driver.actions({ async: true });
			let area = await element.getRect();
			await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).perform();
			await takeScreenshotAndCompare(browserContext, imageBaseName, element);
			await actions.release().perform();
			await getSandboxAndCompare(browserContext, imageBaseName);
		});
	}

	itCheckNonEditArrow(2, 'edit color not set', 125, 175, 325, 225, 'edit_color_not_set');
	itCheckNonEditArrow(0, 'from == to', 275, 225, 290, 210, 'null_vector');

	// TODO check move out of the board
});
