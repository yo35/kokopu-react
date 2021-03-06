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

	function tpl(nodeId, evtOrigin) {
		return `move selected: ${nodeId}\norigin: ${evtOrigin}`;
	}

	itCheckClickMove(0, 'click on disabled', [
		{ searchedText: 'Nf6', expectedText: '' },
		{ searchedText: 'Qc2', expectedText: '' },
	]);

	itCheckClickMove(1, 'click on unselected', [
		{ searchedText: 'cxd5', expectedText: tpl('5w', 'click') },
	]);

	itCheckClickMove(2, 'click on with variations 1', [
		{ searchedText: 'Bb5', expectedText: tpl(undefined, 'click') },
		{ searchedText: 'Nc6', expectedText: tpl('1b-v0-2b', 'click') },
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

			await setSandbox(browserContext, '');
			await focusFieldElement.sendKeys(Key.ARROW_UP);
			await compareSandbox(browserContext, '');
		});
	}

	itCheckKeyboardActions(1, 'key on unselected', '', '', '', '');
	itCheckKeyboardActions(2, 'key on with variations 1', tpl('start', 'key-first'), tpl('1b-v0-2b', 'key-previous'), tpl('1b-v0-3w-v0-3b', 'key-next'), tpl('1b-v0-3w-v0-4w', 'key-last'));
	itCheckKeyboardActions(3, 'key on with variations 2', tpl('start', 'key-first'), tpl('1b-v0-2w', 'key-previous'), tpl('1b-v0-3w', 'key-next'), tpl('1b-v0-3w', 'key-last'));
	itCheckKeyboardActions(4, 'key on start selected', '', '', tpl('1w', 'key-next'), tpl('6b', 'key-last'));
	itCheckKeyboardActions(5, 'key on first selected', tpl('start', 'key-first'), tpl('start', 'key-previous'), tpl('1b', 'key-next'), tpl('6b', 'key-last'));
	itCheckKeyboardActions(6, 'key on last selected', tpl('start', 'key-first'), tpl('6w', 'key-previous'), '', '');
	itCheckKeyboardActions(7, 'key on invalid selection', '', '', '', '');
	itCheckKeyboardActions(8, 'key on sub-variation selected', tpl('start', 'key-first'), tpl('1w', 'key-previous'), tpl('1b-v0-1b', 'key-next'), tpl('1b-v0-3w', 'key-last'));
});
