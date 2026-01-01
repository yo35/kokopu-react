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


const { describeWithBrowser, itChecksScreenshots } = require('./common/graphic');


describeWithBrowser('Chessboard graphic', browserContext => {

    itChecksScreenshots(browserContext, '05_chessboard_graphic/base', [
        'default',
        'empty',
        'parsing error',
        'from FEN',
        'from Kokopu object',
        'wrong position type',
    ]);

    itChecksScreenshots(browserContext, '05_chessboard_graphic/flipped', [
        'default',
        'empty',
        'parsing error',
        'from FEN',
        'from Kokopu object',
    ]);

    itChecksScreenshots(browserContext, '05_chessboard_graphic/annotations', [
        'with coordinates',
        'with coordinates and flip',
        'without coordinates',
        'without coordinates and flip',
        'overlap',
        'overlap and flip',
    ]);

    itChecksScreenshots(browserContext, '05_chessboard_graphic/move', [
        'default',
        'no move arrow',
        'parsing error',
        'with forced move arrow and flip',
        'capture',
        'castling move',
        'en-passant',
        'promotion',
        'wrong move type',
        'wrong move arrow color type',
        'null-move',
        'illegal null-move',
    ]);

    itChecksScreenshots(browserContext, '05_chessboard_graphic/theme', [
        'default',
        'large',
        'small',
        'custom 1',
        'custom 2',
        'custom 3',
        'custom 4',
        'custom 5',
        'custom 6',
        'wrong square size type',
        'wrong colorset',
        'wrong pieceset',
    ]);

    itChecksScreenshots(browserContext, '05_chessboard_graphic/chess_variants', [
        'chess960',
        'chess960 with move',
        'variant without std initial position',
        'variant with std initial position',
        'special code',
        'invalid variant',
        'invalid variant with FEN',
    ]);

});
