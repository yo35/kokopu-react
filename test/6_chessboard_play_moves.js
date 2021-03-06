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
	itCheckPlayMove(3, 'chess960 castling move 1', 275, 375, 75, 375, 'chess960_castling_move_1', 'move played: O-O-O');
	itCheckPlayMove(3, 'chess960 castling move 2', 275, 375, 375, 375, 'chess960_castling_move_2', 'move played: O-O');
	itCheckPlayMove(3, 'chess960 ambiguous king move', 275, 375, 320, 375, 'chess960_ambiguous_king_move', 'move played: Kg1');

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
	itCheckNonPlayMove(3, 'chess960 non-KxR castling', 275, 375, 130, 375, 'chess960_non_kxr_castling');

	function itCheckPlayPromotion(itemIndex, label, xFrom, yFrom, xTo, yTo, xPromo, yPromo, imageBaseName, expectedText) {
		itCustom(browserContext, '11_chessboard_play_promotions', itemIndex, label, async function(element) {
			let actions = browserContext.driver.actions({ async: true });
			let area = await element.getRect();
			await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).release().perform();
			await takeScreenshot(browserContext, imageBaseName, element);
			await actions.move({ x: area.x + xPromo, y: area.y + yPromo }).click().perform();
			await compareScreenshot(browserContext, imageBaseName);
			await compareSandbox(browserContext, expectedText);
		});
	}

	itCheckPlayPromotion(0, 'regular promotion 1', 75, 75, 75, 25, 60, 10, 'regular_promotion_1', 'promotion move played: b8=Q');
	itCheckPlayPromotion(1, 'regular promotion 2', 75, 325, 25, 375, 15, 280, 'regular_promotion_2', 'promotion move played: bxa1=B');
	itCheckPlayPromotion(2, 'antichess promotion', 325, 325, 325, 375, 325, 175, 'antichess_promotion', 'promotion move played: b8=K');

	function itCheckNonPlayPromotion(itemIndex, label, xFrom, yFrom, xTo, yTo, xPromo, yPromo, imageBaseName) {
		itCustom(browserContext, '11_chessboard_play_promotions', itemIndex, label, async function(element) {
			await setSandbox(browserContext, imageBaseName); // can be any value as long as it is unique among other test-cases
			let actions = browserContext.driver.actions({ async: true });
			let area = await element.getRect();
			await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).release().perform();
			await takeScreenshot(browserContext, imageBaseName, element);
			await actions.move({ x: area.x + xPromo, y: area.y + yPromo }).click().perform();
			await compareScreenshot(browserContext, imageBaseName);
			await compareSandbox(browserContext, imageBaseName);
		});
	}

	itCheckNonPlayPromotion(1, 'cancel promotion', 75, 325, 75, 375, 190, 220, 'cancel_promotion');
});
