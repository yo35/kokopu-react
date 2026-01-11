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


const { describeWithBrowser, itChecksScreenshots, itCustom, takeScreenshot, compareScreenshot, waitForAnimation,
    compareGlobalVar } = require('./common/graphic');
const { By } = require('selenium-webdriver');


describeWithBrowser('Chessboard animation', browserContext => {

    itChecksScreenshots(browserContext, '06_chessboard_animation/base_1', [
        'move 1',
        'move 2',
        'capture',
        'castling move',
        'en-passant',
        'promotion',
    ]);

    itChecksScreenshots(browserContext, '06_chessboard_animation/base_2', [
        'move 1',
        'move 2',
        'capture',
        'castling move',
        'en-passant',
        'promotion',
    ]);

    itChecksScreenshots(browserContext, '06_chessboard_animation/base_3', [
        'move 1',
        'move 2',
        'capture',
        'castling move',
        'en-passant',
        'promotion',
    ]);

    async function runSoundTestScenario(element, withMove) {

        // Run the scenario.
        const actions = browserContext.driver.actions({ async: true });
        const button = await element.findElement(By.id(`chessboard-actionButton-${withMove ? 'withMove' : 'noMove'}`));
        await actions.move({ origin: button }).click().perform();
        await waitForAnimation();
        await takeScreenshot(browserContext, withMove ? 'with move' : 'without move', element);

        // Validate the scenario.
        await compareGlobalVar(browserContext, '__kokopu_debug_sound', withMove ? 'sound-done' : '');
        await compareScreenshot(browserContext, withMove ? 'with move' : 'without move');
    }
    itCustom(browserContext, '06_chessboard_animation/sound', 0, 'without move', async element => await runSoundTestScenario(element, false));
    itCustom(browserContext, '06_chessboard_animation/sound', 1, 'with move', async element => await runSoundTestScenario(element, true));

    itCustom(browserContext, '06_chessboard_animation/on_redraw', 0, 'default', async element => {

        // Run the scenario.
        await takeScreenshot(browserContext, 'initial state', element);
        const actions = browserContext.driver.actions({ async: true });
        const button = await element.findElement(By.id('chessboard-actionButton'));
        await actions.move({ origin: button }).click().perform();
        await waitForAnimation();
        await takeScreenshot(browserContext, 'final state', element);

        // Validate the scenario.
        await compareGlobalVar(browserContext, '__kokopu_debug_sound', 'sound-done');
        await compareScreenshot(browserContext, 'initial state');
        await compareScreenshot(browserContext, 'final state');
    });

});
