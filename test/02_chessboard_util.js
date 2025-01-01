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


const { exception, Chessboard, NavigationBoard } = require('../build/test_headless/index');
const test = require('unit.js');


function itInvalidArgument(label, action) {
    it(label, () => { test.exception(action).isInstanceOf(exception.IllegalArgument); });
}


describe('Chessboard.size()', () => {

    function itChessboardSize(label, expectedWidth, expectedHeight, attr) {
        it(label, () => {
            test.value(Chessboard.size(attr)).is({ width: expectedWidth, height: expectedHeight });
        });
    }

    itChessboardSize('Default', 374, 333);
    itChessboardSize('Square size 50', 467, 416, { squareSize: 50 });
    itChessboardSize('Default without coordinates', 364, 320, { coordinateVisible: false });
    itChessboardSize('Default without turn', 330, 333, { turnVisible: false });
    itChessboardSize('Default board only', 320, 320, { coordinateVisible: false, turnVisible: false });

    function topComponent({ squareSize, coordinateVisible, turnVisible }) {
        const width = squareSize * 20;
        const height = (coordinateVisible ? 11 : 0) + (turnVisible ? 107 : 0);
        return { width: width, height: height };
    }

    function bottomComponent({ squareSize, coordinateVisible, turnVisible }) {
        const width = squareSize * 19;
        const height = (coordinateVisible ? 3 : 0) + (turnVisible ? 157 : 0);
        return { width: width, height: height };
    }

    itChessboardSize('With top component', 800, 451, { topComponent: topComponent });
    itChessboardSize('With bottom component', 760, 493, { bottomComponent: bottomComponent });
    itChessboardSize('With top & bottom components', 800, 611, { topComponent: topComponent, bottomComponent: bottomComponent });

    itInvalidArgument('Attribute not an object', () => Chessboard.size('not-an-object'));
    itInvalidArgument('Square size not an integer', () => Chessboard.size({ squareSize: 'not-an-integer' }));
    itInvalidArgument('Small-screen limits not an array', () => Chessboard.size({ smallScreenLimits: 'not-an-array' }));
    itInvalidArgument('Small-screen limit undefined', () => Chessboard.size({ smallScreenLimits: [ undefined ] }));
    itInvalidArgument('Small-screen limit null', () => Chessboard.size({ smallScreenLimits: [ null ] }));
    itInvalidArgument('Small-screen limit not-an-object', () => Chessboard.size({ smallScreenLimits: [ 'not-an-object' ] }));
});


describe('NavigationBoard.size()', () => {

    function itNavigationBoardSize(label, expectedWidth, expectedHeight, attr) {
        it(label, () => {
            test.value(NavigationBoard.size(attr)).is({ width: expectedWidth, height: expectedHeight });
        });
    }

    itNavigationBoardSize('Default', 374, 368);
    itNavigationBoardSize('Minimal square size with all default buttons', 130, 121, {
        squareSize: 12,
        coordinateVisible: false,
        turnVisible: false,
        playButtonVisible: true,
        flipButtonVisible: true,
    });
    itNavigationBoardSize('With additional buttons', 198, 188, {
        squareSize: 20,
        coordinateVisible: false,
        turnVisible: false,
        playButtonVisible: true,
        flipButtonVisible: false,
        additionalButtons: [ 'button', 'button', 'spacer', 'spacer', 'button' ],
    });

    itInvalidArgument('Attribute not an object', () => NavigationBoard.size('not-an-object'));
    itInvalidArgument('Square size not an integer', () => NavigationBoard.size({ squareSize: 'not-an-integer' }));
    itInvalidArgument('Additional buttons not an array', () => NavigationBoard.size({ additionalButtons: 'not-an-array' }));
    itInvalidArgument('Additional buttons with invalid items', () => NavigationBoard.size({ additionalButtons: [ 'not-a-button-nor-a-spacer' ] }));
});


function testAdaptSquareSize(expectedSquareSize, width, height, coordinateVisible, turnVisible, smallScreenLimits) {

    test.value(Chessboard.adaptSquareSize(width, height, {
        coordinateVisible: coordinateVisible,
        turnVisible: turnVisible,
        smallScreenLimits: smallScreenLimits,
    })).is(expectedSquareSize);

    const actualSize = Chessboard.size({
        squareSize: expectedSquareSize,
        coordinateVisible: coordinateVisible,
        turnVisible: turnVisible,
        smallScreenLimits: smallScreenLimits,
    });
    test.value(actualSize.width <= width && actualSize.height <= height).isTrue();
}


function testAdaptSquareSizeWithIncrement(expectedSquareSize, width, height, coordinateVisible, turnVisible, smallScreenLimits) {
    testAdaptSquareSize(expectedSquareSize, width, height, coordinateVisible, turnVisible, smallScreenLimits);

    const actualSizeIncremented = Chessboard.size({
        squareSize: expectedSquareSize + 1,
        coordinateVisible: coordinateVisible,
        turnVisible: turnVisible,
        smallScreenLimits: smallScreenLimits,
    });
    test.value(actualSizeIncremented.width > width || actualSizeIncremented.height > height).isTrue();
}


describe('Adapt square-size', () => {

    it('Very small', () => { test.value(Chessboard.adaptSquareSize(10, 10, { coordinateVisible: false, turnVisible: false })).is(Chessboard.minSquareSize()); });
    it('Very large', () => { test.value(Chessboard.adaptSquareSize(9999, 9999)).is(Chessboard.maxSquareSize()); });

    it('Size 185x300 with coordinates & turn', () => testAdaptSquareSizeWithIncrement(19, 185, 300, true, true));
    it('Size 185x300 without coordinates', () => testAdaptSquareSizeWithIncrement(20, 185, 300, false, true));
    it('Size 185x300 without turn', () => testAdaptSquareSizeWithIncrement(22, 185, 300, true, false));
    it('Size 185x300 board only', () => testAdaptSquareSizeWithIncrement(23, 185, 300, false, false));

    it('Size 300x200 with coordinates & turn', () => testAdaptSquareSizeWithIncrement(23, 300, 200, true, true));
    it('Size 300x200 without coordinates', () => testAdaptSquareSizeWithIncrement(25, 300, 200, false, true));
    it('Size 300x200 without turn', () => testAdaptSquareSizeWithIncrement(23, 300, 200, true, false));
    it('Size 300x200 board only', () => testAdaptSquareSizeWithIncrement(25, 300, 200, false, false));

    it('Size 375x500 with coordinates & turn', () => testAdaptSquareSizeWithIncrement(40, 375, 500, true, true));
    it('Size 375x500 without coordinates', () => testAdaptSquareSizeWithIncrement(41, 375, 500, false, true));
    it('Size 375x500 without turn', () => testAdaptSquareSizeWithIncrement(45, 375, 500, true, false));
    it('Size 375x500 board only', () => testAdaptSquareSizeWithIncrement(46, 375, 500, false, false));

    it('Size 600x450 with coordinates & turn', () => testAdaptSquareSizeWithIncrement(54, 600, 450, true, true));
    it('Size 600x450 without coordinates', () => testAdaptSquareSizeWithIncrement(56, 600, 450, false, true));
    it('Size 600x450 without turn', () => testAdaptSquareSizeWithIncrement(54, 600, 450, true, false));
    it('Size 600x450 board only', () => testAdaptSquareSizeWithIncrement(56, 600, 450, false, false));

    itInvalidArgument('Width <null>', () => Chessboard.adaptSquareSize(null, 400));
    itInvalidArgument('Width not-a-number', () => Chessboard.adaptSquareSize('500', 400));
    itInvalidArgument('Height <undefined>', () => Chessboard.adaptSquareSize(500, undefined));
    itInvalidArgument('Height object', () => Chessboard.adaptSquareSize(500, {}));
    itInvalidArgument('Attribute not-an-object', () => Chessboard.adaptSquareSize(500, 400, 'not-an-object'));
    itInvalidArgument('Small-screen limits not-an-array', () => Chessboard.adaptSquareSize(500, 400, { smallScreenLimits: 'not-an-array' }));
});


describe('Adapt square-size (NavigationBoard)', () => {

    function itAdaptSquareSize(label, width, height, attributes, expectedSquareSize) {
        it(label, () => {
            test.value(NavigationBoard.adaptSquareSize(width, height, attributes)).is(expectedSquareSize);

            const actualSizeIncremented = NavigationBoard.size({
                ...attributes,
                squareSize: expectedSquareSize + 1,
            });
            test.value(actualSizeIncremented.width > width || actualSizeIncremented.height > height).isTrue();
        });
    }

    itAdaptSquareSize('Size 300x300 (default)', 300, 300, {}, 32);
    itAdaptSquareSize('Size 136x200 (with play button)', 136, 200, { coordinateVisible: false, turnVisible: false, playButtonVisible: true }, 15);
    itAdaptSquareSize('Size 136x200 (with minimal buttons)', 136, 200, { coordinateVisible: false, turnVisible: false, flipButtonVisible: false }, 17);

    itInvalidArgument('Width <null>', () => NavigationBoard.adaptSquareSize(null, 400));
    itInvalidArgument('Width not-a-number', () => NavigationBoard.adaptSquareSize('500', 400));
    itInvalidArgument('Height <undefined>', () => NavigationBoard.adaptSquareSize(500, undefined));
    itInvalidArgument('Height object', () => NavigationBoard.adaptSquareSize(500, {}));
    itInvalidArgument('Attribute not-an-object', () => NavigationBoard.adaptSquareSize(500, 400, 'not-an-object'));
    itInvalidArgument('Additional buttons not an array', () => NavigationBoard.adaptSquareSize(500, 400, { additionalButtons: 'not-an-array' }));
    itInvalidArgument('Small-screen limits not-an-array', () => NavigationBoard.adaptSquareSize(500, 400, { smallScreenLimits: 'not-an-array' }));
});


describe('Adapt square-size with small-screen limits', () => {

    const limits = [
        { width: 540, squareSize: 24, turnVisible: false },
        { width: 620, squareSize: 28, coordinateVisible: false },
        { width: 730, squareSize: 32 },
        { width: 860, squareSize: 48 },
    ];

    before(() => {
        global.window = {};
    });
    after(() => {
        delete global.window;
    });

    /* global window */

    it('Window-limited', () => {
        window.innerWidth = 640;
        testAdaptSquareSize(32, 9999, 9999, true, true, limits);
    });

    it('Available-space-limited with coordinates & turn', () => {
        window.innerWidth = 800;
        testAdaptSquareSize(40, 375, 500, true, true, limits);
    });
    it('Available-space-limited without coordinates', () => {
        window.innerWidth = 800;
        testAdaptSquareSize(41, 375, 500, false, true, limits);
    });
    it('Available-space-limited without turn', () => {
        window.innerWidth = 800;
        testAdaptSquareSize(45, 375, 500, true, false, limits);
    });
    it('Available-space-limited board only', () => {
        window.innerWidth = 800;
        testAdaptSquareSize(46, 375, 500, false, false, limits);
    });

    it('Force hidden coordinates', () => {
        window.innerWidth = 600;
        testAdaptSquareSize(20, 185, 300, true, true, limits);
    });
    it('Force hidden coordinates & turn', () => {
        window.innerWidth = 500;
        testAdaptSquareSize(23, 185, 300, true, true, limits);
    });
});
