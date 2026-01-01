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


const { describeWithBrowser, itCustom, setSandbox, compareSandbox, takeScreenshot, compareScreenshot } = require('./common/graphic');


describeWithBrowser('Chessboard play moves', browserContext => {

    function itCheckPlayMove(itemIndex, label, xFrom, yFrom, xTo, yTo, expectedText) {
        itCustom(browserContext, '08_chessboard_play_moves/base', itemIndex, label, async element => {
            const actions = browserContext.driver.actions({ async: true });
            const area = await element.getRect();
            await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).perform();
            await takeScreenshot(browserContext, label, element);
            await actions.release().perform();
            await compareScreenshot(browserContext, label);
            await compareSandbox(browserContext, expectedText);
        });
    }

    itCheckPlayMove(0, 'regular move 1', 225, 335, 220, 225, 'move played: e4');
    itCheckPlayMove(1, 'regular move 2', 275, 225, 135, 85, 'move played: Bxf2+');
    itCheckPlayMove(1, 'castling move', 175, 375, 75, 375, 'move played: O-O');
    itCheckPlayMove(3, 'chess960 castling move 1', 275, 375, 75, 375, 'move played: O-O-O');
    itCheckPlayMove(3, 'chess960 castling move 2', 275, 375, 375, 375, 'move played: O-O');
    itCheckPlayMove(3, 'chess960 ambiguous king move', 275, 375, 320, 375, 'move played: Kg1');

    function itCheckNonPlayMove(itemIndex, label, xFrom, yFrom, xTo, yTo) {
        itCustom(browserContext, '08_chessboard_play_moves/base', itemIndex, label, async element => {
            await setSandbox(browserContext, label); // can be any value as long as it is unique among other test-cases
            const actions = browserContext.driver.actions({ async: true });
            const area = await element.getRect();
            await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).perform();
            await takeScreenshot(browserContext, label, element);
            await actions.release().perform();
            await compareScreenshot(browserContext, label);
            await compareSandbox(browserContext, label);
        });
    }

    itCheckNonPlayMove(2, 'illegal position', 225, 325, 225, 225);
    itCheckNonPlayMove(0, 'wrong color moved', 75, 25, 125, 125);
    itCheckNonPlayMove(0, 'illegal move', 75, 375, 125, 225);
    itCheckNonPlayMove(0, 'from == to', 75, 375, 85, 365);
    itCheckNonPlayMove(0, 'out of board', 325, 375, 450, 285);
    itCheckNonPlayMove(3, 'chess960 non-KxR castling', 275, 375, 130, 375);

    function itCheckPlayPromotion(itemIndex, label, xFrom, yFrom, xTo, yTo, xPromo, yPromo, expectedText) {
        itCustom(browserContext, '08_chessboard_play_moves/promotions', itemIndex, label, async element => {
            const actions = browserContext.driver.actions({ async: true });
            const area = await element.getRect();
            await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).release().perform();
            await takeScreenshot(browserContext, label, element);
            await actions.move({ x: area.x + xPromo, y: area.y + yPromo }).click().perform();
            await compareScreenshot(browserContext, label);
            await compareSandbox(browserContext, expectedText);
        });
    }

    itCheckPlayPromotion(0, 'regular promotion 1', 75, 75, 75, 25, 60, 10, 'promotion move played: b8=Q');
    itCheckPlayPromotion(1, 'regular promotion 2', 75, 325, 25, 375, 15, 280, 'promotion move played: bxa1=B');
    itCheckPlayPromotion(2, 'antichess promotion', 325, 325, 325, 375, 325, 175, 'promotion move played: b8=K');

    function itCheckNonPlayPromotion(itemIndex, label, xFrom, yFrom, xTo, yTo, xPromo, yPromo) {
        itCustom(browserContext, '08_chessboard_play_moves/promotions', itemIndex, label, async element => {
            await setSandbox(browserContext, label); // can be any value as long as it is unique among other test-cases
            const actions = browserContext.driver.actions({ async: true });
            const area = await element.getRect();
            await actions.move({ x: area.x + xFrom, y: area.y + yFrom }).press().move({ x: area.x + xTo, y: area.y + yTo }).release().perform();
            await takeScreenshot(browserContext, label, element);
            await actions.move({ x: area.x + xPromo, y: area.y + yPromo }).click().perform();
            await compareScreenshot(browserContext, label);
            await compareSandbox(browserContext, label);
        });
    }

    itCheckNonPlayPromotion(1, 'cancel promotion', 75, 325, 75, 375, 190, 220);

});
