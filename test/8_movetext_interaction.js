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
const { By, Key } = require('selenium-webdriver');


describe('Movetext interaction', function() {

	const browserContext = {};

	before(async function() {
		await openBrowser(this, browserContext);
	});

	after(async function() {
		await closeBrowser(browserContext);
	});

	function itCheckClickMove(itemIndex, label, targets) {
		itCustom(browserContext, '16_movetext_interaction', itemIndex, label, async function(element) {
			let actions = browserContext.driver.actions({ async: true });
			await setSandbox(browserContext, '');
			for (let i = 0; i < targets.length; ++i) {
				let target = targets[i];
				let moveElement = await element.findElement(By.xpath(`.//span[text()='${target.searchedText}']`));
				await actions.move({ origin: moveElement }).click().perform();
				if (i === 0) {
					await takeScreenshot(browserContext, itemIndex, element);
					await compareScreenshot(browserContext, itemIndex);
				}
				await compareSandbox(browserContext, target.expectedText);
			}
		});
	}

	itCheckClickMove(0, 'click on disabled', [
		{ searchedText: 'Nf6', expectedText: '' },
		{ searchedText: 'Qc2', expectedText: '' },
	]);

	itCheckClickMove(1, 'click on unselected', [
		{ searchedText: 'cxd5', expectedText: 'move selected: 5w' },
	]);

	itCheckClickMove(2, 'click on with variations 1', [
		{ searchedText: 'Bb5', expectedText: 'move selected: undefined' },
		{ searchedText: 'Nc6', expectedText: 'move selected: 1b-v0-2b' },
	]);

	function itCheckKeyboardActions(itemIndex, label, expectedOnGoFirst, expectedOnGoPrevious, expectedOnGoNext, expectedOnGoLast) {
		itCustom(browserContext, '16_movetext_interaction', itemIndex, label, async function(element) {
			let focusFieldElement = await element.findElement(By.className('kokopu-focusField'));

			await setSandbox(browserContext, '');
			await focusFieldElement.sendKeys(Key.HOME);
			await compareSandbox(browserContext, expectedOnGoFirst);

			await setSandbox(browserContext, '');
			await focusFieldElement.sendKeys(Key.ARROW_LEFT);
			await compareSandbox(browserContext, expectedOnGoPrevious);

			await setSandbox(browserContext, '');
			await focusFieldElement.sendKeys(Key.ARROW_RIGHT);
			await compareSandbox(browserContext, expectedOnGoNext);

			await setSandbox(browserContext, '');
			await focusFieldElement.sendKeys(Key.END);
			await compareSandbox(browserContext, expectedOnGoLast);
		});
	}

	itCheckKeyboardActions(1, 'key on unselected', '', '', '', '');
	itCheckKeyboardActions(2, 'key on with variations 1', 'move selected: start', 'move selected: 1b-v0-2b', 'move selected: 1b-v0-3w-v0-3b', 'move selected: 1b-v0-3w-v0-4w');
	itCheckKeyboardActions(3, 'key on with variations 2', 'move selected: start', 'move selected: 1b-v0-2w', 'move selected: 1b-v0-3w', 'move selected: 1b-v0-3w');
	itCheckKeyboardActions(4, 'key on start selected', '', '', 'move selected: 1w', 'move selected: 6b');
	itCheckKeyboardActions(5, 'key on first selected', 'move selected: start', 'move selected: start', 'move selected: 1b', 'move selected: 6b');
	itCheckKeyboardActions(6, 'key on last selected', 'move selected: start', 'move selected: 6w', '', '');
	itCheckKeyboardActions(7, 'key on invalid selection', '', '', '', '');
});
