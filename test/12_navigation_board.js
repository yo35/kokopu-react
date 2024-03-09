/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2024  Yoann Le Montagner <yo35 -at- melix.net>       *
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


describeWithBrowser('Navigation board - Uncontrolled behavior', browserContext => {

    itChecksScreenshots(browserContext, '12_navigation_board/uncontrolled', [
        'initial state default',
        'initial state at end',
        'initial state at specific ID',
        'initial state default with game index',
        'initial state on null-move',
    ]);

    function itCheckClickButton(itemIndex, label, buttons) {
        itCustom(browserContext, '12_navigation_board/uncontrolled', itemIndex, label, async element => {
            await setSandbox(browserContext, '');
            for (let i = 0; i < buttons.length; ++i) {
                const buttonElement = await element.findElement(By.xpath(`.//div[@title='${buttons[i].title}']`));
                await buttonElement.click();
                await compareSandbox(browserContext, buttons[i].expectedSandbox ?? '');
                await takeScreenshot(browserContext, `${label} ${i}`, element);
            }
            for (let i = 0; i < buttons.length; ++i) {
                await compareScreenshot(browserContext, `${label} ${i}`);
            }
        });
    }

    itCheckClickButton(0, 'regular flipping', [
        { title: 'Flip the board' },
        { title: 'Flip the board' },
    ]);

    itCheckClickButton(2, 'regular navigation', [
        { title: 'Go to the next move' },
        { title: 'Go to the previous move' },
        { title: 'Go to the previous move' },
        { title: 'Go to the beginning of the game' },
        { title: 'Go to the end of the game' },
        { title: 'Flip the board' },
    ]);

    itCheckClickButton(3, 'forbidden navigation at beginning', [
        { title: 'Go to the previous move' },
        { title: 'Go to the beginning of the game' },
        { title: 'Flip the board', expectedSandbox: 'Flip state changed: false' },
    ]);

    itCheckClickButton(1, 'forbidden navigation at end', [
        { title: 'Go to the next move' },
        { title: 'Go to the end of the game' },
        { title: 'Flip the board' },
    ]);

    function itCheckPressKey(itemIndex, label, keys) {
        itCustom(browserContext, '12_navigation_board/uncontrolled', itemIndex, label, async element => {
            await setSandbox(browserContext, '');
            const focusFieldElements = await element.findElements(By.className('kokopu-focusField'));

            test.value(focusFieldElements.length).is(1);
            const focusFieldElement = focusFieldElements[0];

            for (let i = 0; i < keys.length; ++i) {
                await focusFieldElement.sendKeys(keys[i].code);
                await compareSandbox(browserContext, keys[i].expectedSandbox ?? '');
                await takeScreenshot(browserContext, `${label} ${i}`, element);
            }
            for (let i = 0; i < keys.length; ++i) {
                await compareScreenshot(browserContext, `${label} ${i}`);
            }
        });
    }

    itCheckPressKey(4, 'navigation with keys', [
        { code: Key.ARROW_LEFT },
        { code: Key.HOME },
        { code: Key.ARROW_RIGHT },
        { code: Key.ESCAPE },
        { code: Key.END },
    ]);

});


describeWithBrowser('Navigation board - Controlled behavior', browserContext => {

    itChecksScreenshots(browserContext, '12_navigation_board/controlled', [
        'default',
        'overriding initial node ID',
        'invalid node ID',
    ]);

    function itCheckClickButton(itemIndex, label, buttons) {
        itCustom(browserContext, '12_navigation_board/controlled', itemIndex, label, async element => {
            await setSandbox(browserContext, '');
            for (let i = 0; i < buttons.length; ++i) {
                const buttonElement = await element.findElement(By.xpath(`.//div[@title='${buttons[i].title}']`));
                await buttonElement.click();
                await compareSandbox(browserContext, buttons[i].expectedSandbox ?? '');
                await takeScreenshot(browserContext, `${label} ${i}`, element);
            }
            for (let i = 0; i < buttons.length; ++i) {
                await compareScreenshot(browserContext, `${label} ${i}`);
            }
        });
    }

    itCheckClickButton(0, 'regular navigation', [
        { title: 'Go to the beginning of the game', expectedSandbox: 'Node ID changed: start' },
        { title: 'Go to the previous move', expectedSandbox: 'Node ID changed: 16b' },
        { title: 'Go to the next move', expectedSandbox: 'Node ID changed: 17b' },
        { title: 'Go to the end of the game', expectedSandbox: 'Node ID changed: 28b' },
    ]);

    itCheckClickButton(1, 'no callback defined', [
        { title: 'Go to the beginning of the game' },
        { title: 'Flip the board' },
    ]);

    itCheckClickButton(2, 'forbidden navigation', [
        { title: 'Go to the previous move' },
        { title: 'Flip the board', expectedSandbox: 'Flip state changed: true' },
    ]);

});


describeWithBrowser('Navigation board graphic', browserContext => {

    itChecksScreenshots(browserContext, '12_navigation_board/error', [
        'pgn parsing error',
        'wrong game type',
    ]);

    itChecksScreenshots(browserContext, '12_navigation_board/theme', [
        'small',
        'large',
        'custom 1',
        'custom 2',
    ]);

});
