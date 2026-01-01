/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2026  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    Kokopu-React is free software: you can redistribute it and/or           *
 *    modify it under the terms of the GNU Lesser General Public License      *
 *    as published by the Free Software Foundation, either version 3 of       *
 *    the License, or (at your option) any later version.                     *
 *                                                                            *
 *    Kokopu-React is distributed in the hope that it will be useful,         *
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of          *
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the            *
 *    GNU Lesser General Public License for more details.                     *
 *                                                                            *
 *    You should have received a copy of the GNU Lesser General               *
 *    Public License along with this program. If not, see                     *
 *    <http://www.gnu.org/licenses/>.                                         *
 *                                                                            *
 * -------------------------------------------------------------------------- */


const { describeWithBrowser, itCustom, setSandbox, compareSandbox, takeScreenshot, compareScreenshot, itChecksScreenshots } = require('./common/graphic');
const { By, Key } = require('selenium-webdriver');
const test = require('unit.js');


describeWithBrowser('Movetext interaction', browserContext => {

    function itCheckClickMove(itemIndex, label, targets) {
        itCustom(browserContext, '11_movetext_interaction/select_moves', itemIndex, label, async element => {
            const actions = browserContext.driver.actions({ async: true });
            await setSandbox(browserContext, '');
            for (let i = 0; i < targets.length; ++i) {
                const target = targets[i];
                const moveElement = await element.findElement(By.xpath(`.//span[text()='${target.searchedText}']`));
                await actions.move({ origin: moveElement }).click().perform();
                if (i === 0) {
                    await takeScreenshot(browserContext, label, element);
                    await compareScreenshot(browserContext, label);
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

    itCheckClickMove(2, 'click on unselected without callback', [
        { searchedText: 'cxd5', expectedText: '' },
    ]);

    itCheckClickMove(3, 'click on with variations', [
        { searchedText: 'Bb5', expectedText: tpl(undefined, 'click') },
        { searchedText: 'Nc6', expectedText: tpl('1b-v0-2b', 'click') },
    ]);

    function itCheckKeyboardActions(itemIndex, label, expectedOnGoFirst, expectedOnGoPrevious, expectedOnGoNext, expectedOnGoLast, expectedOnExit) {
        itCustom(browserContext, '11_movetext_interaction/select_moves', itemIndex, label, async element => {
            const focusFieldElements = await element.findElements(By.className('kokopu-focusField'));

            // Handle components for which no interaction is defined.
            if (focusFieldElements.length === 0) {
                test.value('').is(expectedOnGoFirst);
                test.value('').is(expectedOnGoPrevious);
                test.value('').is(expectedOnGoNext);
                test.value('').is(expectedOnGoLast);
                test.value('').is(expectedOnExit);
                return;
            }

            test.value(focusFieldElements.length).is(1);
            const focusFieldElement = focusFieldElements[0];

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
            await focusFieldElement.sendKeys(Key.ESCAPE);
            await compareSandbox(browserContext, expectedOnExit);

            await setSandbox(browserContext, '');
            await focusFieldElement.sendKeys(Key.ARROW_UP);
            await compareSandbox(browserContext, '');
        });
    }

    const TPL_EXIT = tpl(undefined, 'key-exit');

    itCheckKeyboardActions(0, 'key on disabled', '', '', '', '', '');
    itCheckKeyboardActions(1, 'key on unselected', '', '', '', '', '');
    itCheckKeyboardActions(3, 'key on with variations 1', tpl('start', 'key-first'), tpl('1b-v0-2b', 'key-previous'), tpl('1b-v0-3w-v0-3b', 'key-next'),
        tpl('1b-v0-3w-v0-4w', 'key-last'), TPL_EXIT);
    itCheckKeyboardActions(4, 'key on with variations 2', tpl('start', 'key-first'), tpl('1b-v0-2w', 'key-previous'), tpl('1b-v0-3w', 'key-next'),
        tpl('1b-v0-3w', 'key-last'), TPL_EXIT);
    itCheckKeyboardActions(5, 'key on start selected', '', '', tpl('1w', 'key-next'), tpl('6b', 'key-last'), TPL_EXIT);
    itCheckKeyboardActions(6, 'key on first selected', tpl('start', 'key-first'), tpl('start', 'key-previous'), tpl('1b', 'key-next'), tpl('6b', 'key-last'), TPL_EXIT);
    itCheckKeyboardActions(7, 'key on last selected', tpl('start', 'key-first'), tpl('6w', 'key-previous'), '', '', TPL_EXIT);
    itCheckKeyboardActions(8, 'key on invalid selection', '', '', '', '', '');
    itCheckKeyboardActions(9, 'key on sub-variation selected', tpl('start', 'key-first'), tpl('1w', 'key-previous'), tpl('1b-v0-1b', 'key-next'),
        tpl('1b-v0-3w', 'key-last'), TPL_EXIT);

    itChecksScreenshots(browserContext, '11_movetext_interaction/error', [
        'wrong interaction mode',
    ]);

});
