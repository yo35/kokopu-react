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


import * as React from 'react';

import { IllegalArgument } from '../exception';
import { sanitizeBoundedInteger } from '../sanitization';
import { MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, ChessPieceIconType, isChessPieceIconType } from '../types';
import { piecesets, DEFAULT_PIECESET } from '../chessboard/piecesets';


export interface ChessPieceIconProps {

	/**
	 * Width and height (in pixels) of each chess piece icon.
	 */
	size: number;

	/**
	 * Chess piece(s) to display.
	 */
	type: ChessPieceIconType | ChessPieceIconType[];

	/**
	 * Piece theme ID. Must be a property of `Chessboard.piecesets()`.
	 */
	pieceset: string;
}


const defaultProps: Partial<ChessPieceIconProps> = {
	pieceset: DEFAULT_PIECESET,
};


/**
 * SVG icon representing a colored chess piece, or a list of colored chess pieces.
 */
export function ChessPieceIcon({ size, type, pieceset }: ChessPieceIconProps) {

	// Sanitize the inputs.
	size = sanitizeBoundedInteger(size, MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, () => new IllegalArgument('ChessPieceIcon', 'size'));
	const types = sanitizeChessPieceIconType(type, () => new IllegalArgument('ChessPieceIcon', 'type'));
	const piecesetData = piecesets[pieceset];
	if (!piecesetData) {
		throw new IllegalArgument('ChessPieceIcon', 'pieceset');
	}

	// Render the component.
	const width = size * types.length;
	const viewBox = `0 0 ${width} ${size}`;
	return (
		<svg className="kokopu-chessPieceIcon" viewBox={viewBox} width={width} height={size}>
			{types.map((t, i) => <image key={i} x={i * size} y={0} width={size} height={size} href={piecesetData[t]} />)}
		</svg>
	);
}

ChessPieceIcon.defaultProps = defaultProps;


/**
 * Sanitization method for the small-screen limits parameter.
 */
function sanitizeChessPieceIconType(type: ChessPieceIconType | ChessPieceIconType[], exceptionBuilder: () => IllegalArgument): ChessPieceIconType[] {
	if (Array.isArray(type)) {
		return type.map(t => {
			if (!isChessPieceIconType(t)) {
				throw exceptionBuilder();
			}
			return t;
		});
	}
	else if (isChessPieceIconType(type)) {
		return [ type ];
	}
	else {
		throw exceptionBuilder();
	}
}
