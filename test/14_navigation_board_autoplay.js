/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2025  Yoann Le Montagner <yo35 -at- melix.net>       *
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


const { describeWithBrowser, itCustom, setSandbox, compareSandbox, takeScreenshot, compareScreenshot, itChecksScreenshots, waitForAutoplay } = require('./common/graphic');
const { By } = require('selenium-webdriver');


const PLAY_STOP_BUTTON_TITLE = 'Play/stop the game';


describeWithBrowser('Navigation board auto-play - Uncontrolled behavior', browserContext => {

    itChecksScreenshots(browserContext, '14_navigation_board_autoplay/uncontrolled', [
        'initial state default',
        'initial state close to end',
    ]);

    function itCheckClickWaitClick(itemIndex, label, nbMoves) {
        itCustom(browserContext, '14_navigation_board_autoplay/uncontrolled', itemIndex, label, async element => {
            const buttonElement = await element.findElement(By.xpath(`.//div[@title='${PLAY_STOP_BUTTON_TITLE}']`));
            await buttonElement.click();
            await waitForAutoplay(nbMoves);
            await takeScreenshot(browserContext, `${label} before stop`, element);
            await buttonElement.click();
            await takeScreenshot(browserContext, `${label} after stop`, element);
            await compareScreenshot(browserContext, `${label} before stop`);
            await compareScreenshot(browserContext, `${label} after stop`);
        });
    }

    itCheckClickWaitClick(0, 'after 2 moves from beginning', 2);
    itCheckClickWaitClick(1, 'after reaching the end', 1);
});


describeWithBrowser('Navigation board auto-play - Controlled behavior', browserContext => {

    itChecksScreenshots(browserContext, '14_navigation_board_autoplay/controlled', [
        'initial state not acknowledging node changes',
        'initial state acknowledging node changes',
        'initial state close to end',
        'initial state not acknowledging is-playing changes',
        'initial state acknowledging is-playing changes',
        'initial state at the end',
    ]);

    function itCheckClickWaitClick(itemIndex, label, nbMoves, expectedSandboxAfterClick1, expectedSandboxAfterClick2) {
        itCustom(browserContext, '14_navigation_board_autoplay/controlled', itemIndex, label, async element => {
            await setSandbox(browserContext, '');
            const buttonElement = await element.findElement(By.xpath(`.//div[@title='${PLAY_STOP_BUTTON_TITLE}']`));
            await buttonElement.click();
            await compareSandbox(browserContext, expectedSandboxAfterClick1);
            await waitForAutoplay(nbMoves);
            await buttonElement.click();
            await takeScreenshot(browserContext, label, element);
            await compareSandbox(browserContext, expectedSandboxAfterClick2);
            await compareScreenshot(browserContext, label);
        });
    }

    itCheckClickWaitClick(0, 'after 2 moves not acknowledging node changes', 2, '', 'Node ID changed: 3b');
    itCheckClickWaitClick(1, 'after 2 moves acknowledging node changes', 2, '', 'Node ID changed: 3b\nNode ID changed: 4w');
    itCheckClickWaitClick(2, 'after reaching the end', 1, '', 'Node ID changed: 20b');
    itCheckClickWaitClick(3, 'after 1 move not acknowledging is-playing changes', 1, 'is-playing flag changed: true', 'is-playing flag changed: true');
    itCheckClickWaitClick(4, 'after 1 move acknowledging is-playing changes', 1, 'is-playing flag changed: true', 'is-playing flag changed: false');

    function itCheckClick(itemIndex, label, expectedSandboxAfterClick) {
        itCustom(browserContext, '14_navigation_board_autoplay/controlled', itemIndex, label, async element => {
            await setSandbox(browserContext, '');
            const buttonElement = await element.findElement(By.xpath(`.//div[@title='${PLAY_STOP_BUTTON_TITLE}']`));
            await buttonElement.click();
            await takeScreenshot(browserContext, label, element);
            await compareSandbox(browserContext, expectedSandboxAfterClick);
            await compareScreenshot(browserContext, label);
        });
    }

    itCheckClick(5, 'already at the end', '');
});
