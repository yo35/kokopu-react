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


import { AnnotationColor } from '../types';
import { DEFAULT_COLORSET } from './colorsets';
import { DEFAULT_PIECESET } from './piecesets';


/**
 * Define a limit applicable to the parameters of a {@link Chessboard} on small-screen devices.
 */
export interface SmallScreenLimit {
    width: number,
    squareSize?: number,
    coordinateVisible?: boolean,
    turnVisible?: boolean,
}


/**
 * Properties in relation to the appearance of a `Chessboard` component (excluding properties related to move display).
 */
export interface StaticBoardGraphicProps {

    /**
     * Size of the squares (in pixels). Must be an integer between `Chessboard.minSquareSize()` and `Chessboard.maxSquareSize()`.
     */
    squareSize: number,

    /**
     * Whether the row and column coordinates are visible or not.
     */
    coordinateVisible: boolean,

    /**
     * Whether the turn flag is visible or not.
     */
    turnVisible: boolean,

    /**
     * Color theme ID. Must be a property of `Chessboard.colorsets()`.
     */
    colorset: string,

    /**
     * Piece theme ID. Must be a property of `Chessboard.piecesets()`.
     */
    pieceset: string,

    /**
     * Limits applicable on small-screen devices. For instance, if set to
     * ```
     * [
     *   { width: 768, squareSize: 40 },
     *   { width: 375, squareSize: 24, coordinateVisible: false }
     * ]
     * ```
     * then on screens with resolution ≤768 pixels, the square size will be limited to 40 (whatever the value
     * of the `squareSize` attribute); in addition, on screens with resolution ≤375 pixels, the square size
     * will be limited to 24 and the row and column coordinates will always be hidden (whatever the value of the
     * `coordinateVisible` attribute).
     */
    smallScreenLimits?: SmallScreenLimit[],
}


/**
 * Properties in relation to the appearance of a `Chessboard` component (including properties related to move display).
 */
export interface DynamicBoardGraphicProps extends StaticBoardGraphicProps {

    /**
     * Whether moves are highlighted with an arrow or not.
     */
    moveArrowVisible: boolean,

    /**
     * Color of the move arrow.
     */
    moveArrowColor: AnnotationColor,

    /**
     * Whether moves are animated or not.
     */
    animated: boolean,
}


export const DEFAULT_SQUARE_SIZE = 40;


export function defaultStaticBoardProps(): StaticBoardGraphicProps {
    return {
        squareSize: DEFAULT_SQUARE_SIZE,
        coordinateVisible: true,
        turnVisible: true,
        colorset: DEFAULT_COLORSET,
        pieceset: DEFAULT_PIECESET,
    };
}


export function defaultDynamicBoardProps(): DynamicBoardGraphicProps {
    return {
        ...defaultStaticBoardProps(),
        moveArrowVisible: true,
        moveArrowColor: 'b',
        animated: false,
    };
}
