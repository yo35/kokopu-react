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


const { describeWithBrowser, itCustom, setSandbox, compareSandbox, itChecksScreenshots } = require('./common/graphic');
const { By } = require('selenium-webdriver');


describeWithBrowser('Navigation board graphic', browserContext => {

    itChecksScreenshots(browserContext, '13_navigation_board_graphic/error', [
        'pgn parsing error',
        'wrong game type',
    ]);

    itChecksScreenshots(browserContext, '13_navigation_board_graphic/theme', [
        'small',
        'large',
        'custom 1',
        'custom 2',
    ]);

    itChecksScreenshots(browserContext, '13_navigation_board_graphic/additional_buttons', [
        'single button',
        'multiple buttons',
        'error 1',
        'error 2',
    ]);

    function itCheckClickButton(itemIndex, label, buttons) {
        itCustom(browserContext, '13_navigation_board_graphic/additional_buttons', itemIndex, label, async element => {
            await setSandbox(browserContext, '');
            for (let i = 0; i < buttons.length; ++i) {
                const buttonElement = await element.findElement(By.xpath(`.//div[@title='${buttons[i].title}']`));
                await buttonElement.click();
                await compareSandbox(browserContext, buttons[i].expectedSandbox ?? '');
            }
        });
    }

    itCheckClickButton(1, 'click on additional buttons', [
        { title: 'Button A', expectedSandbox: 'Button A clicked' },
        { title: 'Button 0', expectedSandbox: 'Button A clicked' }, // No callback binded to button 0
        { title: 'Button B', expectedSandbox: 'Button B clicked' },
        { title: 'Button C', expectedSandbox: 'Button B clicked' }, // Callback is not supposed to be invoked since button C is disabled.
    ]);

});
