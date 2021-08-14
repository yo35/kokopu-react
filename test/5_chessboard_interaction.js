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


const { openBrowser, closeBrowser, itCustom, getSandboxAndCompare } = require('./common/graphic');


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
});
