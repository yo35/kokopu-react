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
import { i18n } from '../i18n';
import { PieceSymbolMapping, isPieceSymbolMapping } from '../types';

import './fonts.css';


/**
 * Render the given SAN notation according to the given piece symbol style.
 *
 * @param pieceSymbols - See {@link moveFormatter}.
 * @param notation - SAN notation.
 */
export function formatMove(pieceSymbols: 'native' | 'localized' | 'figurines' | PieceSymbolMapping, notation: string): React.ReactNode {
	const formatter = moveFormatter(pieceSymbols);
	return formatter(notation);
}


/**
 * Return a callback capable of rendering a SAN notation using the given piece symbol style.
 *
 * @param pieceSymbols - One of the following piece symbol style:
 *                       - `'native'`: use the English chess piece initials (i.e. K, Q, R, B, N, P).
 *                       - `'localized'`: use the piece symbols defined in {@link i18n.PIECE_SYMBOLS}.
 *                       - `'figurines'`: use a figurine font.
 *                       - {@link PieceSymbolMapping}: use the given custom set of chess piece symbols.
 */
export function moveFormatter(pieceSymbols: 'native' | 'localized' | 'figurines' | PieceSymbolMapping): (notation: string) => React.ReactNode {
	if (pieceSymbols === 'native') {
		return notation => notation;
	}
	else if (pieceSymbols === 'localized') {
		const mapping = i18n.PIECE_SYMBOLS;
		return notation => pieceMappingNotation(mapping, notation);
	}
	else if (pieceSymbols === 'figurines') {
		return notation => figurineNotation('alpha', notation);
	}
	else if (isPieceSymbolMapping(pieceSymbols)) {
		return notation => pieceMappingNotation(pieceSymbols, notation);
	}
	else {
		throw new IllegalArgument('moveFormatter', 'pieceSymbols');
	}
}


/**
 * Replace the native piece symbols by those defined by the given {@link PieceSymbolMapping}.
 */
function pieceMappingNotation(mapping: PieceSymbolMapping, text: string) {
	return text.replace(/[KQRBNP]/g, match => mapping[match as keyof PieceSymbolMapping]);
}


/**
 * Decompose the given string into piece symbol characters and sections of non piece symbol characters, and transform the piece symbols into
 * React objects represented with the given chess font.
 */
function figurineNotation(fontName: string, text: string): React.ReactNode {
	const result: React.ReactNode[] = [];
	let beginOfText = 0;
	let pieceSymbolIndex = 0;
	for (let pos = 0; pos < text.length; ++pos) {
		const currentChar = text.charAt(pos);
		if (currentChar === 'K' || currentChar === 'Q' || currentChar === 'R' || currentChar === 'B' || currentChar === 'N' || currentChar === 'P') {
			if (pos > beginOfText) {
				result.push(text.substring(beginOfText, pos));
			}
			beginOfText = pos + 1;
			const key = 'symbol-' + (pieceSymbolIndex++);
			result.push(<span className={'kokopu-font-' + fontName} key={key}>{currentChar}</span>);
		}
	}
	if (beginOfText < text.length) {
		result.push(text.substring(beginOfText));
	}
	return <>{result}</>;
}
