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
