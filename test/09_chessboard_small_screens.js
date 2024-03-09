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


const { describeWithBrowser, itCustom, itChecksScreenshots, takeScreenshot, compareScreenshot, setWindowWidth } = require('./common/graphic');


describeWithBrowser('Chessboard on small-screens', browserContext => {

    itChecksScreenshots(browserContext, '09_chessboard_small_screens/base', [
        'default',
        'invalid limits',
    ]);

    function itCheckScreenshotWithWidth(width) {
        const label = `width ${width}`;
        itCustom(browserContext, '09_chessboard_small_screens/base', 0, label, async element => {
            await setWindowWidth(browserContext, width);
            await takeScreenshot(browserContext, label, element);
            await compareScreenshot(browserContext, label);
        });
    }

    itCheckScreenshotWithWidth(750);
    itCheckScreenshotWithWidth(740);
    itCheckScreenshotWithWidth(730);
    itCheckScreenshotWithWidth(720);
    itCheckScreenshotWithWidth(710);
    itCheckScreenshotWithWidth(700);
    itCheckScreenshotWithWidth(690);

});


describeWithBrowser('Chessboard on small-screens with top/bottom components', browserContext => {

    itChecksScreenshots(browserContext, '09_chessboard_small_screens/top_bottom_components', [
        'default top component',
        'default bottom component',
    ]);

    function itCheckScreenshotWithReducedWidth(itemIndex, label) {
        itCustom(browserContext, '09_chessboard_small_screens/top_bottom_components', itemIndex, label, async element => {
            await setWindowWidth(browserContext, 700);
            await takeScreenshot(browserContext, label, element);
            await compareScreenshot(browserContext, label);
        });
    }

    itCheckScreenshotWithReducedWidth(0, 'reduced top component');
    itCheckScreenshotWithReducedWidth(1, 'reduced bottom component');

});
