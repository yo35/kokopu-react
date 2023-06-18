/* -------------------------------------------------------------------------- *
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2023  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    This program is free software: you can redistribute it and/or           *
 *    modify it under the terms of the GNU Lesser General Public License      *
 *    as published by the Free Software Foundation, either version 3 of       *
 *    the License, or (at your option) any later version.                     *
 *                                                                            *
 *    This program is distributed in the hope that it will be useful,         *
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

import { exception as kokopuException, MoveDescriptor, Position, Square, GameVariant, isSquare, isSquareCouple, isGameVariant } from 'kokopu';

import { IllegalArgument } from '../exception';
import { i18n } from '../i18n';
import { sanitizeString, sanitizeBoolean, sanitizePartialObject, sanitizeInteger, sanitizeBoundedInteger, sanitizeOptional } from '../sanitization';
import { MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, Colorset, Pieceset, AnnotationColor, AnnotationSymbol, SquareMarkerSet, TextMarkerSet, ArrowMarkerSet,
	isAnnotationColor, isAnnotationSymbol, parseSquareMarkers, parseTextMarkers, parseArrowMarkers } from '../types';

import { colorsets, DEFAULT_COLORSET } from './colorsets';
import { piecesets, DEFAULT_PIECESET } from './piecesets';
import { ChessboardImpl, chessboardSize } from './ChessboardImpl';
import { ErrorBox } from '../errorbox/ErrorBox';


/**
 * Define a limit applicable to the parameters of a {@link Chessboard} on small-screen devices.
 */
export interface SmallScreenLimit {
	width: number;
	squareSize?: number;
	coordinateVisible?: boolean;
	turnVisible?: boolean;
}


export interface ChessboardProps {

	/**
	 * Displayed position. Can be a [kokopu.Position](https://kokopu.yo35.org/docs/current/classes/Position.html) object,
	 * a [FEN string](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation),
	 * `'start'` (usual starting position), or `'empty'` (empty board).
	 *
	 * Optionally, the FEN string can be prefixed with `'variant:'`, `variant` corresponding to one of the
	 * [game variant](https://kokopu.yo35.org/docs/current/types/GameVariant.html) supported by Kokopu. For instance:
	 * `'chess960:nrkbqrbn/pppppppp/8/8/8/8/PPPPPPPP/NRKBQRBN w KQkq - 0 1'`.
	 */
	position: Position | string;

	/**
	 * Displayed move (optional), defined either as a [kokopu.MoveDescriptor](https://kokopu.yo35.org/docs/current/classes/MoveDescriptor.html) object
	 * or as a [SAN string](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)) (e.g. `'Nf3'`). In both cases, it must represent
	 * a legal move in position defined in attribute `position`.
	 */
	move?: MoveDescriptor | string;

	/**
	 * Square markers, defined as a {@link SquareMarkerSet} (e.g. `{ e4: 'g', d5: 'r' }`) or as a comma-separated CSL string (e.g. `'Rd5,Ge4'`).
	 */
	squareMarkers?: SquareMarkerSet | string;

	/**
	 * Text markers, defined as a {@link TextMarkerSet} (e.g. `{ e4: { symbol: 'A', color: 'g' }, d5: { symbol: 'z', color: 'r' }}`)
	 * or as a comma-separated CTL string (e.g. `'Rzd5,GAe4'`).
	 */
	textMarkers?: TextMarkerSet | string;

	/**
	 * Arrow markers, defined as a {@link ArrowMarkerSet} (e.g. `{ e2e4: 'g', g8f6: 'r', g8h6: 'y' }`)
	 * or as a comma-separated CAL string (e.g. `'Ge2e4,Rg8f6,Yg8h6'`).
	 */
	arrowMarkers?: ArrowMarkerSet | string;

	/**
	 * Whether the board is flipped (i.e. seen from Black's point of view) or not.
	 */
	flipped: boolean;

	/**
	 * Size of the squares (in pixels). Must be an integer between `Chessboard.minSquareSize()` and `Chessboard.maxSquareSize()`.
	 */
	squareSize: number;

	/**
	 * Whether the row and column coordinates are visible or not.
	 */
	coordinateVisible: boolean;

	/**
	 * Whether the turn flag is visible or not.
	 */
	turnVisible: boolean;

	/**
	 * Whether moves are highlighted with an arrow or not.
	 */
	moveArrowVisible: boolean;

	/**
	 * Color of the move arrow.
	 */
	moveArrowColor: AnnotationColor;

	/**
	 * Whether moves are animated or not.
	 */
	animated: boolean;

	/**
	 * Color theme ID. Must be a property of `Chessboard.colorsets()`.
	 */
	colorset: string;

	/**
	 * Piece theme ID. Must be a property of `Chessboard.piecesets()`.
	 */
	pieceset: string;

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
	smallScreenLimits?: SmallScreenLimit[];

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
	editedArrowColor?: AnnotationColor;

	/**
	 * Callback invoked when a piece is moved through drag&drop (only if `interactionMode` is set to `'movePieces'`).
	 */
	onPieceMoved?: (from: Square, to: Square) => void;

	/**
	 * Callback invoked when the user clicks on a square (only if `interactionMode` is set to `'clickSquares'`).
	 */
	onSquareClicked?: (square: Square) => void;

	/**
	 * Callback invoked when an arrow is dragged (only if `interactionMode` is set to `'editArrows'`).
	 */
	onArrowEdited?: (from: Square, to: Square) => void;

	/**
	 * Callback invoked when a move is played (only if `interactionMode` is set to `'playMoves'`).
	 */
	onMovePlayed?: (move: string) => void;
}


interface ChessboardState {
	windowWidth: number;
}


const DEFAULT_SQUARE_SIZE = 40;


/**
 * SVG image representing a chessboard diagram. Optionally, the user may interact with the board (move pieces, click on squares...).
 * Annotations such as square markers or arrows can also be added to the board.
 */
export class Chessboard extends React.Component<ChessboardProps, ChessboardState> {

	static defaultProps: Partial<ChessboardProps> = {
		position: 'start',
		flipped: false,
		squareSize: DEFAULT_SQUARE_SIZE,
		coordinateVisible: true,
		turnVisible: true,
		moveArrowVisible: true,
		moveArrowColor: 'b',
		animated: false,
		colorset: DEFAULT_COLORSET,
		pieceset: DEFAULT_PIECESET,
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
		const positionInfo = parsePosition(this.props.position);
		if (positionInfo.error) {
			return <ErrorBox title={i18n.INVALID_FEN_ERROR_TITLE} message={positionInfo.message} />;
		}
		const position = positionInfo.position;
		const moveInfo = parseMove(position, this.props.move);
		if (moveInfo.error) {
			return <ErrorBox title={i18n.INVALID_NOTATION_ERROR_TITLE} message={moveInfo.message} />;
		}
		const move = moveInfo.move;

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

		// Validate the interaction attributes and the callbacks.
		const interactionMode = this.getInteractionModeAndValidateEditedArrowColor();
		const { onPieceMoved, onSquareClicked, onArrowEdited, onMovePlayed } = this.props;

		// Build a key so that a new `ChessboardImpl` component is instantiated each time the position or the move changes
		// (mandatory to ensure that the move animation works properly and that the internal state of the component remains consistent).
		const key = `${position.variant()}|${position.fen()}|${move ? position.notation(move) : ''}`;

		return (
			<ChessboardImpl key={key}
				position={position} move={move} squareMarkers={sqm} textMarkers={txtm} arrowMarkers={arm} flipped={flipped}
				squareSize={actualSquareSize} coordinateVisible={actualCoordinateVisible} turnVisible={actualTurnVisible}
				moveArrowVisible={moveArrowVisible} moveArrowColor={this.props.moveArrowColor} animated={animated}
				colorset={colorset} pieceset={pieceset}
				interactionMode={interactionMode} editedArrowColor={this.props.editedArrowColor}
				onPieceMoved={onPieceMoved} onSquareClicked={onSquareClicked} onArrowEdited={onArrowEdited} onMovePlayed={onMovePlayed}
			/>
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
	static size(attr?: Partial<Pick<ChessboardProps, 'squareSize' | 'coordinateVisible' | 'turnVisible' | 'smallScreenLimits'>>): { width: number, height: number } {
		let { squareSize, coordinateVisible, turnVisible, smallScreenLimits } = sanitizePartialObject(attr, () => new IllegalArgument('Chessboard.size()', 'attr'));

		// Sanitize the arguments.
		squareSize = squareSize === undefined ? DEFAULT_SQUARE_SIZE :
			sanitizeBoundedInteger(squareSize, MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, () => new IllegalArgument('Chessboard.size()', 'squareSize'));
		coordinateVisible = coordinateVisible === undefined ? true : sanitizeBoolean(coordinateVisible);
		turnVisible = turnVisible === undefined ? true : sanitizeBoolean(turnVisible);
		smallScreenLimits = sanitizeSmallScreenLimits(smallScreenLimits, () => new IllegalArgument('Chessboard.size()', 'smallScreenLimits'));

		// Enforce small-screen limits, if any.
		if (typeof window !== 'undefined') {
			squareSize = computeSquareSizeForSmallScreens(squareSize, smallScreenLimits, window.innerWidth);
			coordinateVisible = computeCoordinateVisibleForSmallScreens(coordinateVisible, smallScreenLimits, window.innerWidth);
			turnVisible = computeTurnVisibleForSmallScreens(turnVisible, smallScreenLimits, window.innerWidth);
		}

		// Compute the dimensions.
		return chessboardSize(squareSize, coordinateVisible, turnVisible);
	}

	/**
	 * Return the maximum square size that would allow the chessboard to fit in a rectangle of size `width x height`.
	 */
	static adaptSquareSize(width: number, height: number, attr?: Partial<Pick<ChessboardProps, 'coordinateVisible' | 'turnVisible' | 'smallScreenLimits'>>): number {
		let { coordinateVisible, turnVisible, smallScreenLimits } = sanitizePartialObject(attr, () => new IllegalArgument('Chessboard.size()', 'attr'));

		// Sanitize the arguments.
		width = sanitizeInteger(width, () => new IllegalArgument('Chessboard.adaptSquareSize()', 'width'));
		height = sanitizeInteger(height, () => new IllegalArgument('Chessboard.adaptSquareSize()', 'height'));
		coordinateVisible = coordinateVisible === undefined ? true : sanitizeBoolean(coordinateVisible);
		turnVisible = turnVisible === undefined ? true : sanitizeBoolean(turnVisible);
		smallScreenLimits = sanitizeSmallScreenLimits(smallScreenLimits, () => new IllegalArgument('Chessboard.adaptSquareSize()', 'smallScreenLimits'));

		// Enforce small-screen limits, if any.
		let maxSquareSize = MAX_SQUARE_SIZE;
		if (typeof window !== 'undefined') {
			maxSquareSize = computeSquareSizeForSmallScreens(maxSquareSize, smallScreenLimits, window.innerWidth);
			coordinateVisible = computeCoordinateVisibleForSmallScreens(coordinateVisible, smallScreenLimits, window.innerWidth);
			turnVisible = computeTurnVisibleForSmallScreens(turnVisible, smallScreenLimits, window.innerWidth);
		}

		function isAdapted(squareSize: number) {
			const { width: actualWidth, height: actualHeight } = chessboardSize(squareSize, coordinateVisible!, turnVisible!);
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
 * Try to interpret the given object as a chess position.
 */
function parsePosition(position: Position | string): { error: true, message: string } | { error: false, position: Position } {
	if (position instanceof Position) {
		return { error: false, position: position };
	}
	else if (position === 'start' || position === 'empty') {
		return { error: false, position: new Position(position) };
	}
	else if (typeof position === 'string') {
		try {
			const { variant, fen } = splitGameVariantAndFEN(position);
			const result = new Position(variant, 'empty');
			result.fen(fen);
			return { error: false, position: result };
		}
		catch (e) {
			// istanbul ignore else
			if (e instanceof kokopuException.InvalidFEN) {
				return { error: true, message: e.message };
			}
			else {
				throw e;
			}
		}
	}
	else {
		throw new IllegalArgument('Chessboard', 'position');
	}
}


/**
 * Look for an optional 'chess-variant:' prefix in the position attribute.
 */
function splitGameVariantAndFEN(position: string): { variant: GameVariant, fen: string } {
	const separatorIndex = position.indexOf(':');
	if (separatorIndex < 0) {
		return { variant: 'regular', fen: position };
	}
	const variant = position.substring(0, separatorIndex);
	return isGameVariant(variant) ? { variant: variant, fen: position.substring(separatorIndex + 1) } : { variant: 'regular', fen: position };
}


/**
 * Try to interpret the given object `move` as a move descriptor based on the given position.
 */
function parseMove(position: Position, move: MoveDescriptor | string | undefined): { error: true, message: string } | { error: false, move: MoveDescriptor | undefined } {
	if (move === undefined || move === null) {
		return { error: false, move: undefined };
	}
	else if (move instanceof MoveDescriptor) {
		return { error: false, move: move };
	}
	else if (typeof move === 'string') {
		try {
			return { error: false, move: position.notation(move) };
		}
		catch (e) {
			// istanbul ignore else
			if (e instanceof kokopuException.InvalidNotation) {
				return { error: true, message: e.message };
			}
			else {
				throw e;
			}
		}
	}
	else {
		throw new IllegalArgument('Chessboard', 'move');
	}
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
				turnVisible: sanitizeOptional(smallScreenLimit.turnVisible, sanitizeBoolean)
			};
		});
	}
}
