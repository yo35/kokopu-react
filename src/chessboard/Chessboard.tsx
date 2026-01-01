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


import * as React from 'react';

import { MoveDescriptor, Position, Square, isSquare, isSquareCouple } from 'kokopu';

import { IllegalArgument } from '../exception';
import { sanitizeString, sanitizeBoolean, sanitizePartialObject, sanitizeInteger, sanitizeBoundedInteger, sanitizeOptional } from '../sanitization';
import { MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, Colorset, Pieceset, AnnotationColor, AnnotationSymbol, SquareMarkerSet, TextMarkerSet, ArrowMarkerSet,
    isAnnotationColor, isAnnotationSymbol, parseSquareMarkers, parseTextMarkers, parseArrowMarkers } from '../types';

import { StaticBoardGraphicProps, DynamicBoardGraphicProps, SmallScreenLimit, DEFAULT_SQUARE_SIZE, defaultDynamicBoardProps } from './BoardProperties';
import { colorsets } from './colorsets';
import { piecesets } from './piecesets';
import { ChessboardImpl, chessboardSize } from './ChessboardImpl';
import { parsePosition, parseMove } from '../errorbox/parsing';


export interface ChessboardProps extends DynamicBoardGraphicProps {

    /**
     * Displayed position. Can be a [kokopu.Position](https://kokopu.yo35.org/docs/current/classes/Position.html) object,
     * a [FEN string](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation),
     * `'start'` (usual starting position), or `'empty'` (empty board).
     *
     * Optionally, the FEN string can be prefixed with `'variant:'`, `variant` corresponding to one of the
     * [game variant](https://kokopu.yo35.org/docs/current/types/GameVariant.html) supported by Kokopu. For instance:
     * `'chess960:nrkbqrbn/pppppppp/8/8/8/8/PPPPPPPP/NRKBQRBN w KQkq - 0 1'`.
     */
    position: Position | string,

    /**
     * Displayed move (optional), defined either as a [kokopu.MoveDescriptor](https://kokopu.yo35.org/docs/current/classes/MoveDescriptor.html) object
     * or as a [SAN string](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)) (e.g. `'Nf3'`). Use `'--'` for a null-move.
     * In all cases, the move must be a legal move in position defined in attribute `position`.
     */
    move?: MoveDescriptor | string,

    /**
     * Square markers, defined as a {@link SquareMarkerSet} (e.g. `{ e4: 'g', d5: 'r' }`) or as a comma-separated CSL string (e.g. `'Rd5,Ge4'`).
     */
    squareMarkers?: SquareMarkerSet | string,

    /**
     * Text markers, defined as a {@link TextMarkerSet} (e.g. `{ e4: { symbol: 'A', color: 'g' }, d5: { symbol: 'z', color: 'r' }}`)
     * or as a comma-separated CTL string (e.g. `'Rzd5,GAe4'`).
     */
    textMarkers?: TextMarkerSet | string,

    /**
     * Arrow markers, defined as a {@link ArrowMarkerSet} (e.g. `{ e2e4: 'g', g8f6: 'r', g8h6: 'y' }`)
     * or as a comma-separated CAL string (e.g. `'Ge2e4,Rg8f6,Yg8h6'`).
     */
    arrowMarkers?: ArrowMarkerSet | string,

    /**
     * Whether the board is flipped (i.e. seen from Black's point of view) or not.
     */
    flipped: boolean,

    /**
     * Type of action allowed with the mouse on the chessboard. If undefined, then the user cannot interact with the component.
     *
     * - `'movePieces'` allows the user to drag & drop the chess pieces from one square to another (regardless of the chess rules),
     * - `'clickSquares'` allows the user to click on squares,
     * - `'editArrows'` allows the user to draw arrow markers from one square to another (warning: attribute `editedArrowColor` must be set),
     * - `'playMoves'` allows the user to play legal chess moves (thus no interaction is possible if the displayed position is not legal).
     */
    interactionMode?: 'movePieces' | 'clickSquares' | 'editArrows' | 'playMoves',

    /**
     * Color of the edited arrow. Mandatory if `interactionMode === 'editArrows'`, ignored otherwise.
     */
    editedArrowColor?: AnnotationColor,

    /**
     * Callback invoked when a piece is moved through drag&drop (only if `interactionMode` is set to `'movePieces'`).
     */
    onPieceMoved?: (from: Square, to: Square) => void,

    /**
     * Callback invoked when the user clicks on a square (only if `interactionMode` is set to `'clickSquares'`).
     */
    onSquareClicked?: (square: Square) => void,

    /**
     * Callback invoked when an arrow is dragged (only if `interactionMode` is set to `'editArrows'`).
     */
    onArrowEdited?: (from: Square, to: Square) => void,

    /**
     * Callback invoked when a move is played (only if `interactionMode` is set to `'playMoves'`).
     */
    onMovePlayed?: (move: string) => void,

    /**
     * Optional component, to be rendered above the chessboard, and customized with the same square-size / coordinate-visible / turn-visible
     * parameter values as actually used for the chessboard (which may be different from what is defined in props because of small-screen limits).
     */
    topComponent?: (attr: Pick<StaticBoardGraphicProps, 'squareSize' | 'coordinateVisible' | 'turnVisible'>) => React.JSX.Element,

    /**
     * Optional component, to be rendered below the chessboard, and customized with the same square-size / coordinate-visible / turn-visible
     * parameter values as actually used for the chessboard (which may be different from what is defined in props because of small-screen limits).
     */
    bottomComponent?: (attr: Pick<StaticBoardGraphicProps, 'squareSize' | 'coordinateVisible' | 'turnVisible'>) => React.JSX.Element,
}


type AuxilliaryComponentSizeFunction = (attr: Pick<StaticBoardGraphicProps, 'squareSize' | 'coordinateVisible' | 'turnVisible'>) => { width: number, height: number };


/**
 * Attributes for method `Chessboard.size()`.
 */
export interface ChessboardSizeAttr {
    squareSize?: ChessboardProps['squareSize'],
    coordinateVisible?: ChessboardProps['coordinateVisible'],
    turnVisible?: ChessboardProps['turnVisible'],
    smallScreenLimits?: ChessboardProps['smallScreenLimits'],
    topComponent?: AuxilliaryComponentSizeFunction,
    bottomComponent?: AuxilliaryComponentSizeFunction,
}


/**
 * Attributes for method `Chessboard.adaptSquareSize()`.
 */
export interface ChessboardAdaptSquareSizeAttr {
    coordinateVisible?: ChessboardProps['coordinateVisible'],
    turnVisible?: ChessboardProps['turnVisible'],
    smallScreenLimits?: ChessboardProps['smallScreenLimits'],
    topComponent?: AuxilliaryComponentSizeFunction,
    bottomComponent?: AuxilliaryComponentSizeFunction,
}


interface ChessboardState {
    windowWidth: number,
}


/**
 * SVG image representing a chessboard diagram. Optionally, the user may interact with the board (move pieces, click on squares...).
 * Annotations such as square markers or arrows can also be added to the board.
 */
export class Chessboard extends React.Component<ChessboardProps, ChessboardState> {

    static defaultProps: Partial<ChessboardProps> = {
        ...defaultDynamicBoardProps(),
        position: 'start',
        flipped: false,
    };

    private windowResizeListener = () => this.handleWindowResize();

    constructor(props: ChessboardProps) {
        super(props);
        this.state = {
            windowWidth: window.innerWidth,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.windowResizeListener);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeListener);
    }

    private handleWindowResize() {
        this.setState({ windowWidth: window.innerWidth });
    }

    render() {

        // Validate the position and move attributes.
        const positionInfo = parsePosition(this.props.position, 'Chessboard');
        if (positionInfo.error) {
            return positionInfo.errorBox;
        }
        let position = positionInfo.position;
        const moveInfo = parseMove(position, this.props.move, 'Chessboard');
        if (moveInfo.error) {
            return moveInfo.errorBox;
        }
        const move = moveInfo.type === 'regular' ? moveInfo.move : undefined;
        if (moveInfo.type === 'null-move') {
            position = new Position(position);
            position.playNullMove();
        }

        // Validate the markers
        const sqm = parseMarkers(this.props.squareMarkers, 'squareMarkers', parseSquareMarkers, isSquare, isAnnotationColor);
        const txtm = parseMarkers(this.props.textMarkers, 'textMarkers', parseTextMarkers, isSquare, isTextMarkerElement);
        const arm = parseMarkers(this.props.arrowMarkers, 'arrowMarkers', parseArrowMarkers, isSquareCouple, isAnnotationColor);

        // Validate the appearance attributes.
        const flipped = sanitizeBoolean(this.props.flipped);
        const squareSize = sanitizeBoundedInteger(this.props.squareSize, MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, () => new IllegalArgument('Chessboard', 'squareSize'));
        const coordinateVisible = sanitizeBoolean(this.props.coordinateVisible);
        const turnVisible = sanitizeBoolean(this.props.turnVisible);
        const moveArrowVisible = sanitizeBoolean(this.props.moveArrowVisible);
        if (!isAnnotationColor(this.props.moveArrowColor)) {
            throw new IllegalArgument('Chessboard', 'moveArrowColor');
        }
        const animated = sanitizeBoolean(this.props.animated);
        const colorset = colorsets[this.props.colorset];
        if (!colorset) {
            throw new IllegalArgument('Chessboard', 'colorset');
        }
        const pieceset = piecesets[this.props.pieceset];
        if (!pieceset) {
            throw new IllegalArgument('Chessboard', 'pieceset');
        }

        // Validate and enforce the small-screen limits.
        const smallScreenLimits = sanitizeSmallScreenLimits(this.props.smallScreenLimits, () => new IllegalArgument('Chessboard', 'smallScreenLimits'));
        const actualSquareSize = computeSquareSizeForSmallScreens(squareSize, smallScreenLimits, this.state.windowWidth);
        const actualCoordinateVisible = computeCoordinateVisibleForSmallScreens(coordinateVisible, smallScreenLimits, this.state.windowWidth);
        const actualTurnVisible = computeTurnVisibleForSmallScreens(turnVisible, smallScreenLimits, this.state.windowWidth);
        const auxilliaryComponentAttr = {
            squareSize: actualSquareSize,
            coordinateVisible: actualCoordinateVisible,
            turnVisible: actualTurnVisible,
        };

        // Validate the interaction attributes and the callbacks.
        const interactionMode = this.getInteractionModeAndValidateEditedArrowColor();
        const { onPieceMoved, onSquareClicked, onArrowEdited, onMovePlayed } = this.props;

        // Build a key so that a new `ChessboardImpl` component is instantiated each time the position or the move changes
        // (mandatory to ensure that the move animation works properly and that the internal state of the component remains consistent).
        const key = `${position.variant()}|${position.fen()}|${move ? position.notation(move) : ''}`;

        return (
            <>
                {this.props.topComponent ? this.props.topComponent(auxilliaryComponentAttr) : undefined}
                <ChessboardImpl
                    key={key}
                    position={position} move={move} squareMarkers={sqm} textMarkers={txtm} arrowMarkers={arm} flipped={flipped}
                    squareSize={actualSquareSize} coordinateVisible={actualCoordinateVisible} turnVisible={actualTurnVisible}
                    moveArrowVisible={moveArrowVisible} moveArrowColor={this.props.moveArrowColor} animated={animated}
                    colorset={colorset} pieceset={pieceset}
                    interactionMode={interactionMode} editedArrowColor={this.props.editedArrowColor}
                    onPieceMoved={onPieceMoved} onSquareClicked={onSquareClicked} onArrowEdited={onArrowEdited} onMovePlayed={onMovePlayed}
                />
                {this.props.bottomComponent ? this.props.bottomComponent(auxilliaryComponentAttr) : undefined}
            </>
        );
    }

    private getInteractionModeAndValidateEditedArrowColor() {
        const interactionMode = sanitizeOptional(this.props.interactionMode, sanitizeString);
        if (interactionMode === undefined || interactionMode === 'movePieces' || interactionMode === 'clickSquares' || interactionMode === 'playMoves') {
            return interactionMode;
        }
        else if (interactionMode === 'editArrows') {
            if (!isAnnotationColor(this.props.editedArrowColor)) {
                throw new IllegalArgument('Chessboard', 'editedArrowColor');
            }
            return interactionMode;
        }
        else {
            throw new IllegalArgument('Chessboard', 'interactionMode');
        }
    }

    /**
     * Return the size of the chessboard, assuming it is built with the given attributes.
     */
    static size(attr?: ChessboardSizeAttr): { width: number, height: number } {
        const { squareSize, coordinateVisible, turnVisible, smallScreenLimits, topComponent, bottomComponent } = sanitizePartialObject(attr,
            () => new IllegalArgument('Chessboard.size()', 'attr'));

        // Sanitize the arguments.
        let actualSquareSize = squareSize === undefined ?
            DEFAULT_SQUARE_SIZE :
            sanitizeBoundedInteger(squareSize, MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, () => new IllegalArgument('Chessboard.size()', 'squareSize'));
        let actualCoordinateVisible = coordinateVisible === undefined ? true : sanitizeBoolean(coordinateVisible);
        let actualTurnVisible = turnVisible === undefined ? true : sanitizeBoolean(turnVisible);
        const actualLimits = sanitizeSmallScreenLimits(smallScreenLimits, () => new IllegalArgument('Chessboard.size()', 'smallScreenLimits'));

        // Enforce small-screen limits, if any.
        if (typeof window !== 'undefined') {
            actualSquareSize = computeSquareSizeForSmallScreens(actualSquareSize, actualLimits, window.innerWidth);
            actualCoordinateVisible = computeCoordinateVisibleForSmallScreens(actualCoordinateVisible, actualLimits, window.innerWidth);
            actualTurnVisible = computeTurnVisibleForSmallScreens(actualTurnVisible, actualLimits, window.innerWidth);
        }

        // Compute the dimensions.
        return chessBoardWithAuxilliaryComponentSize(actualSquareSize, actualCoordinateVisible, actualTurnVisible, topComponent, bottomComponent);
    }

    /**
     * Return the maximum square size that would allow the chessboard to fit in a rectangle of size `width x height`.
     */
    static adaptSquareSize(width: number, height: number, attr?: ChessboardAdaptSquareSizeAttr): number {
        const { coordinateVisible, turnVisible, smallScreenLimits, topComponent, bottomComponent } = sanitizePartialObject(attr,
            () => new IllegalArgument('Chessboard.adaptSquareSize()', 'attr'));

        // Sanitize the arguments.
        width = sanitizeInteger(width, () => new IllegalArgument('Chessboard.adaptSquareSize()', 'width'));
        height = sanitizeInteger(height, () => new IllegalArgument('Chessboard.adaptSquareSize()', 'height'));
        let actualCoordinateVisible = coordinateVisible === undefined ? true : sanitizeBoolean(coordinateVisible);
        let actualTurnVisible = turnVisible === undefined ? true : sanitizeBoolean(turnVisible);
        const actualLimits = sanitizeSmallScreenLimits(smallScreenLimits, () => new IllegalArgument('Chessboard.adaptSquareSize()', 'smallScreenLimits'));

        // Enforce small-screen limits, if any.
        let maxSquareSize = MAX_SQUARE_SIZE;
        if (typeof window !== 'undefined') {
            maxSquareSize = computeSquareSizeForSmallScreens(maxSquareSize, actualLimits, window.innerWidth);
            actualCoordinateVisible = computeCoordinateVisibleForSmallScreens(actualCoordinateVisible, actualLimits, window.innerWidth);
            actualTurnVisible = computeTurnVisibleForSmallScreens(actualTurnVisible, actualLimits, window.innerWidth);
        }

        function isAdapted(squareSize: number) {
            const { width: actualWidth, height: actualHeight } = chessBoardWithAuxilliaryComponentSize(squareSize, actualCoordinateVisible, actualTurnVisible,
                topComponent, bottomComponent);
            return actualWidth <= width && actualHeight <= height;
        }

        // Check min/max bounds.
        if (isAdapted(maxSquareSize)) {
            return maxSquareSize;
        }
        else if (!isAdapted(MIN_SQUARE_SIZE)) {
            return MIN_SQUARE_SIZE;
        }

        // Dichotomic search, between a (inclusive) and b (exclusive).
        let a = MIN_SQUARE_SIZE;
        let b = maxSquareSize;
        while (a + 1 < b) {
            const mid = Math.floor((a + b) / 2);
            if (isAdapted(mid)) {
                a = mid;
            }
            else {
                b = mid;
            }
        }
        return a;
    }

    /**
     * Minimum square size (inclusive).
     *
     * @public
     */
    static minSquareSize(): number {
        return MIN_SQUARE_SIZE;
    }

    /**
     * Maximum square size (inclusive).
     *
     * @public
     */
    static maxSquareSize(): number {
        return MAX_SQUARE_SIZE;
    }

    /**
     * Available colorsets for theming.
     *
     * @public
     */
    static colorsets(): Record<string, Colorset> {
        return colorsets;
    }

    /**
     * Available piecesets for theming.
     *
     * @public
     */
    static piecesets(): Record<string, Pieceset> {
        return piecesets;
    }
}


function chessBoardWithAuxilliaryComponentSize(squareSize: number, coordinateVisible: boolean, turnVisible: boolean,
    topComponent: AuxilliaryComponentSizeFunction | undefined, bottomComponent: AuxilliaryComponentSizeFunction | undefined): { width: number, height: number } {

    let { width, height } = chessboardSize(squareSize, coordinateVisible, turnVisible);
    const auxilliaryComponentAttr = {
        squareSize: squareSize,
        coordinateVisible: coordinateVisible,
        turnVisible: turnVisible,
    };

    if (topComponent) {
        const { width: auxilliaryWidth, height: auxilliaryHeight } = topComponent(auxilliaryComponentAttr);
        width = Math.max(width, auxilliaryWidth);
        height += auxilliaryHeight;
    }
    if (bottomComponent) {
        const { width: auxilliaryWidth, height: auxilliaryHeight } = bottomComponent(auxilliaryComponentAttr);
        width = Math.max(width, auxilliaryWidth);
        height += auxilliaryHeight;
    }

    return { width: width, height: height };
}


/**
 * Compute the actual square size taking into account the given small-screen limits and window width.
 */
function computeSquareSizeForSmallScreens(squareSize: number, smallScreenLimits: SmallScreenLimit[], windowWidth: number) {
    const maximumSquareSize = computeSmallScreenLimits(smallScreenLimits, windowWidth, limit => limit.squareSize);
    return maximumSquareSize === undefined ? squareSize : Math.min(squareSize, maximumSquareSize);
}


/**
 * Compute the actual coordinate visibility attribute taking into account the given small-screen limits and window width.
 */
function computeCoordinateVisibleForSmallScreens(coordinateVisible: boolean, smallScreenLimits: SmallScreenLimit[], windowWidth: number) {
    const maximumCoordinateVisible = computeSmallScreenLimits(smallScreenLimits, windowWidth, limit => limit.coordinateVisible);
    return maximumCoordinateVisible === undefined ? coordinateVisible : coordinateVisible && maximumCoordinateVisible;
}


/**
 * Compute the actual turn flag visibility attribute taking into account the given small-screen limits and window width.
 */
function computeTurnVisibleForSmallScreens(turnVisible: boolean, smallScreenLimits: SmallScreenLimit[], windowWidth: number) {
    const maximumTurnVisible = computeSmallScreenLimits(smallScreenLimits, windowWidth, limit => limit.turnVisible);
    return maximumTurnVisible === undefined ? turnVisible : turnVisible && maximumTurnVisible;
}


/**
 * Compute the limit applicable to the given window width.
 */
function computeSmallScreenLimits<T>(smallScreenLimits: SmallScreenLimit[], windowWidth: number, getter: (limit: SmallScreenLimit) => T | undefined): T | undefined {
    let bestWidth = Infinity;
    let bestAttributeValue: T | undefined = undefined;
    for (const limit of smallScreenLimits) {

        // Discard the limits not applicable to the current window width (`windowWidth <= limit.width` must hold)
        // and those for which the target attribute is not defined.
        if (windowWidth > limit.width || getter(limit) === undefined) {
            continue;
        }

        // Find the limit with the smallest width among those applicable.
        if (limit.width < bestWidth) {
            bestWidth = limit.width;
            bestAttributeValue = getter(limit);
        }
    }
    return bestAttributeValue;
}


/**
 * Try to interpret the given object as a list of markers.
 */
function parseMarkers<K extends string, V>(markers: Partial<Record<K, V>> | string | undefined, argumentName: string, parse: (m: string) => Partial<Record<K, V>>,
    isValidKey: (k: unknown) => k is K, isValidValue: (v: unknown) => v is V): Partial<Record<K, V>> | undefined {

    if (markers === undefined || markers === null) {
        return undefined;
    }
    else if (typeof markers === 'string') {
        return parse(markers);
    }
    else if (typeof markers === 'object') {
        const result: Partial<Record<K, V>> = {};
        Object.entries(markers).forEach(([ key, value ]) => {
            if (isValidKey(key) && isValidValue(value)) {
                result[key] = value;
            }
        });
        return result;
    }
    else {
        throw new IllegalArgument('Chessboard', argumentName);
    }
}


function isTextMarkerElement(value: unknown): value is { symbol: AnnotationSymbol, color: AnnotationColor } {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    return isAnnotationSymbol((value as Record<string, unknown>).symbol) && isAnnotationColor((value as Record<string, unknown>).color);
}


/**
 * Sanitization method for the small-screen limits parameter.
 */
function sanitizeSmallScreenLimits(smallScreenLimits: SmallScreenLimit[] | undefined, exceptionBuilder: () => IllegalArgument): SmallScreenLimit[] {
    if (smallScreenLimits === undefined || smallScreenLimits === null) {
        return [];
    }
    else if (!Array.isArray(smallScreenLimits)) {
        throw exceptionBuilder();
    }
    else {
        return smallScreenLimits.map(smallScreenLimit => {
            if (typeof smallScreenLimit !== 'object' || smallScreenLimit === null) {
                throw exceptionBuilder();
            }
            return {
                width: sanitizeInteger(smallScreenLimit.width, exceptionBuilder),
                squareSize: sanitizeOptional(smallScreenLimit.squareSize, val => sanitizeBoundedInteger(val, MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, exceptionBuilder)),
                coordinateVisible: sanitizeOptional(smallScreenLimit.coordinateVisible, sanitizeBoolean),
                turnVisible: sanitizeOptional(smallScreenLimit.turnVisible, sanitizeBoolean),
            };
        });
    }
}
