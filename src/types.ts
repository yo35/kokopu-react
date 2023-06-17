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


import { ColoredPiece, Square, SquareCouple, isColoredPiece, isSquare, isSquareCouple } from 'kokopu';

import { IllegalArgument } from './exception';


/**
 * Minimum square size in a {@link Chessboard} component.
 */
export const MIN_SQUARE_SIZE = 12;

/**
 * Maximum square size in a {@link Chessboard} component.
 */
export const MAX_SQUARE_SIZE = 96;


/**
 * Type of icon representing a (colored) chess piece.
 *
 * The two special values `'wx'` and `'bx'` correspond to the turn flags.
 */
export type ChessPieceIconType = ColoredPiece | 'wx' | 'bx';


/**
 * Whether the given object is a {@link ChessPieceIconType} or not.
 */
export function isChessPieceIconType(iconType: unknown): iconType is ChessPieceIconType {
	return isColoredPiece(iconType) || iconType === 'wx' || iconType === 'bx';
}


/**
 * Set of parameters describing the colors to use to render a {@link Chessboard} component.
 *
 * Each color is defined as string, that must be interpreted as a [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
 */
export type Colorset = {

	/** Color of the black squares. */
	b: string;

	/** Color of the white squares. */
	w: string;

	/** Color of the blue markers. */
	cb: string;

	/** Color of the green markers. */
	cg: string;

	/** Color of the red markers. */
	cr: string;

	/** Color of the yellow markers. */
	cy: string;
};


/**
 * Set of parameters describing the chess pieces to use to render a {@link Chessboard} component.
 *
 * Each field is a string corresponding to the URL of the image of the corresponding chess piece.
 */
export type Pieceset = {

	/** Image for the black bishops. */
	bb: string;

	/** Image for the black kings. */
	bk: string;

	/** Image for the black knights. */
	bn: string;

	/** Image for the black pawns. */
	bp: string;

	/** Image for the black queens. */
	bq: string;

	/** Image for the black rooks. */
	br: string;

	/** Image for the black turn flags. */
	bx: string;

	/** Image for the white bishops. */
	wb: string;

	/** Image for the white kings. */
	wk: string;

	/** Image for the white knights. */
	wn: string;

	/** Image for the white pawns. */
	wp: string;

	/** Image for the white queens. */
	wq: string;

	/** Image for the white rooks. */
	wr: string;

	/** Image for the white turn flags. */
	wx: string;
};


/**
 * Set of aliases for chess pieces symbols.
 */
export type PieceSymbolMapping = {
	K: string;
	Q: string;
	R: string;
	B: string;
	N: string;
	P: string;
};


/**
 * Whether the given object is a {@link PieceSymbolMapping} or not.
 */
export function isPieceSymbolMapping(mapping: unknown): mapping is PieceSymbolMapping {
	if (typeof mapping !== 'object' || mapping === null) {
		return false;
	}
	return typeof (mapping as PieceSymbolMapping).K === 'string' &&
		typeof (mapping as PieceSymbolMapping).Q === 'string' &&
		typeof (mapping as PieceSymbolMapping).R === 'string' &&
		typeof (mapping as PieceSymbolMapping).B === 'string' &&
		typeof (mapping as PieceSymbolMapping).N === 'string' &&
		typeof (mapping as PieceSymbolMapping).P === 'string';
}


/**
 * Symbol that can be chosen to decorate a square in a {@link Chessboard}.
 */
export type AnnotationSymbol = 'plus' | 'times' | 'dot' | 'circle' |
	'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' |
	'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' |
	'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';


/**
 * Whether the given object is a {@link AnnotationSymbol} or not.
 */
export function isAnnotationSymbol(symbol: unknown): symbol is AnnotationSymbol {
	return typeof symbol === 'string' && /^(?:[A-Za-z0-9]|plus|times|dot|circle)$/.test(symbol);
}


/**
 * Color that can be chosen to decorate a square or draw an arrow in a {@link Chessboard}.
 */
export type AnnotationColor = 'b' | 'g' | 'r' | 'y';


/**
 * Whether the given object is a {@link AnnotationSymbol} or not.
 */
export function isAnnotationColor(color: unknown): color is AnnotationColor {
	return color === 'b' || color === 'g' || color === 'r' || color === 'y';
}


/**
 * Set of square markers (i.e. colorized squares in a {@link Chessboard}).
 */
export type SquareMarkerSet = Partial<Record<Square, AnnotationColor>>;


/**
 * Set of text markers (i.e. colorized symbols that can decorate the squares of a {@link Chessboard}).
 */
export type TextMarkerSet = Partial<Record<Square, { symbol: AnnotationSymbol, color: AnnotationColor }>>;


/**
 * Set of arrow markers (i.e. colorized arrows between two squares in a {@link Chessboard}).
 */
export type ArrowMarkerSet = Partial<Record<SquareCouple, AnnotationColor>>;


/**
 * Transform a {@link SquareMarkerSet} into a comma-separated string.
 *
 * @param markers - For example: `{ e4: 'g', d5: 'r' }`
 * @returns For example: `'Gd5,Ge4'`
 */
export function flattenSquareMarkers(markers: SquareMarkerSet): string {
	if (typeof markers !== 'object' || markers === null) {
		throw new IllegalArgument('flattenSquareMarkers()', 'markers');
	}
	return Object.entries(markers)
		.filter(([ sq, color ]) => isSquare(sq) && isAnnotationColor(color))
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([ sq, color ]) => color.toUpperCase() + sq)
		.join(',');
}


/**
 * Transform a {@link TextMarkerSet} into a comma-separated string.
 *
 * @param markers - For example: `{ e4: { symbol: 'A', color: 'g' }, d5: { symbol: 'z', color: 'r' }, h3: { symbol: 'plus', color: 'y' } }`
 * @returns For example: `'Rzd5,GAe4,Y(plus)h3'`
 */
export function flattenTextMarkers(markers: TextMarkerSet): string {
	if (typeof markers !== 'object' || markers === null) {
		throw new IllegalArgument('flattenTextMarkers()', 'markers');
	}
	return Object.entries(markers)
		.filter(([ sq, desc ]) => isSquare(sq) && desc && isAnnotationColor(desc.color) && isAnnotationSymbol(desc.symbol))
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([ sq, desc ]) => desc.color.toUpperCase() + (desc.symbol.length === 1 ? desc.symbol : `(${desc.symbol})`) + sq)
		.join(',');
}


/**
 * Transform a {@link ArrowMarkerSet} into a comma-separated string.
 *
 * @param markers - For example: `{ e2e4: 'g', g8f6: 'r', g8h6: 'b' }`
 * @returns For example: `'Ge2e4,Rg8f6,Bg8h6'`
 */
export function flattenArrowMarkers(markers: ArrowMarkerSet): string {
	if (typeof markers !== 'object' || markers === null) {
		throw new IllegalArgument('flattenArrowMarkers()', 'markers');
	}
	return Object.entries(markers)
		.filter(([ vect, color ]) => isSquareCouple(vect) && isAnnotationColor(color))
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([ vect, color ]) => color.toUpperCase() + vect)
		.join(',');
}


/**
 * Parse a comma-separated string representing a {@link SquareMarkerSet}.
 *
 * @param markers - For example: `'Gd5,Ge4'`
 * @returns For example: `{ e4: 'g', d5: 'r' }`
 */
export function parseSquareMarkers(markers: string): SquareMarkerSet {
	if (typeof markers !== 'string') {
		throw new IllegalArgument('parseSquareMarkers()', 'markers');
	}
	return parseMarkers<Square, AnnotationColor>(markers, token => {
		return /^([BGRY])([a-h][1-8])$/.test(token) ?
			{ key: RegExp.$2 as Square, value: RegExp.$1.toLowerCase() as AnnotationColor } :
			undefined;
	});
}


/**
 * Parse a comma-separated string representing a {@link TextMarkerSet}.
 *
 * @param markers - For example: `'Rzd5,GAe4,Y(plus)h3'`
 * @returns For example: `{ e4: { symbol: 'A', color: 'g' }, d5: { symbol: 'z', color: 'r' }, h3: { symbol: 'plus', color: 'y' } }`
 */
export function parseTextMarkers(markers: string): TextMarkerSet {
	if (typeof markers !== 'string') {
		throw new IllegalArgument('parseTextMarkers()', 'markers');
	}
	return parseMarkers<Square, { symbol: AnnotationSymbol, color: AnnotationColor }>(markers, token => {
		return /^([BGRY])(?:([A-Za-z0-9])|\((plus|times|dot|circle)\))([a-h][1-8])$/.test(token) ?
			{ key: RegExp.$4 as Square, value: { symbol: (RegExp.$2 || RegExp.$3) as AnnotationSymbol, color: RegExp.$1.toLowerCase() as AnnotationColor } } :
			undefined;
	});
}


/**
 * Parse a comma-separated string representing a {@link ArrowMarkerSet}.
 *
 * @param markers - For example: `'Ge2e4,Rg8f6,Bg8h6'`
 * @returns For example: `{ e2e4: 'g', g8f6: 'r', g8h6: 'b' }`
 */
export function parseArrowMarkers(markers: string): ArrowMarkerSet {
	if (typeof markers !== 'string') {
		throw new IllegalArgument('parseArrowMarkers()', 'markers');
	}
	return parseMarkers<SquareCouple, AnnotationColor>(markers, token => {
		return /^([BGRY])([a-h][1-8][a-h][1-8])$/.test(token) ?
			{ key: RegExp.$2 as SquareCouple, value: RegExp.$1.toLowerCase() as AnnotationColor } :
			undefined;
	});
}


function parseMarkers<K extends string, V>(markers: string, tokenParser: (token: string) => { key: K, value: V } | undefined): Partial<Record<K, V>> {
	const result: Partial<Record<K, V>> = {};
	markers.split(',').map(token => tokenParser(token.trim())).forEach(marker => {
		if (marker) {
			result[marker.key] = marker.value;
		}
	});
	return result;
}
