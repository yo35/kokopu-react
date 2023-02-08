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


const { describeWithBrowser, itChecksScreenshots, itCustom, takeScreenshot, compareScreenshot, waitForAnimation } = require('./common/graphic');
const { By } = require('selenium-webdriver');


describeWithBrowser('Chessboard animation', browserContext => {

	itChecksScreenshots(browserContext, '09a_chessboard_animated_move', [
		'move 1',
		'move 2',
		'capture',
		'castling move',
		'en-passant',
		'promotion',
	]);

	itChecksScreenshots(browserContext, '09b_chessboard_animated_move', [
		'move 1',
		'move 2',
		'capture',
		'castling move',
		'en-passant',
		'promotion',
	]);

	itChecksScreenshots(browserContext, '09c_chessboard_animated_move', [
		'move 1',
		'move 2',
		'capture',
		'castling move',
		'en-passant',
		'promotion',
	]);

	itCustom(browserContext, '10_chessboard_animation_on_redraw', 0, 'default', async element => {

		// Run the scenario.
		await takeScreenshot(browserContext, 'initial state', element);
		const actions = browserContext.driver.actions({ async: true });
		const button = await element.findElement(By.id('chessboard-action-button'));
		await actions.move({ origin: button }).click().perform();
		await waitForAnimation();
		await takeScreenshot(browserContext, 'final state', element);

		// Check the screenshots.
		await compareScreenshot(browserContext, 'initial state');
		await compareScreenshot(browserContext, 'final state');
	});

});
