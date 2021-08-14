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

	itCustom(browserContext, '07_chessboard_click_squares', 0, 'default', async function(element) {
		let actions = browserContext.driver.actions({ async: true });
		let area = await element.getRect();
		await actions.move({ x: area.x + 225, y: area.y + 75 }).click().perform();
		await getSandboxAndCompare(browserContext, 'square clicked: e7');
		await actions.move({ x: area.x + 25, y: area.y + 375 }).click().perform();
		await getSandboxAndCompare(browserContext, 'square clicked: a1');
		await actions.move({ x: area.x + 325, y: area.y + 175 }).click().perform();
		await getSandboxAndCompare(browserContext, 'square clicked: g5');
	});

	itCustom(browserContext, '07_chessboard_click_squares', 1, 'with flip', async function(element) {
		let actions = browserContext.driver.actions({ async: true });
		let area = await element.getRect();
		await actions.move({ x: area.x + 325, y: area.y + 175 }).click().perform();
		await getSandboxAndCompare(browserContext, 'square clicked: b4');
	});

	itCustom(browserContext, '07_chessboard_click_squares', 2, 'over annotations', async function(element) {
		let actions = browserContext.driver.actions({ async: true });
		let area = await element.getRect();
		await actions.move({ x: area.x + 25, y: area.y + 25 }).click().perform();
		await getSandboxAndCompare(browserContext, 'square clicked: a8');
		await actions.move({ x: area.x + 75, y: area.y + 125 }).click().perform();
		await getSandboxAndCompare(browserContext, 'square clicked: b6');
		await actions.move({ x: area.x + 175, y: area.y + 125 }).click().perform();
		await getSandboxAndCompare(browserContext, 'square clicked: d6');
		await actions.move({ x: area.x + 75, y: area.y + 225 }).click().perform();
		await getSandboxAndCompare(browserContext, 'square clicked: b4');
	});

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
});
