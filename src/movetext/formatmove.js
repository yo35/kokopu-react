/******************************************************************************
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
 ******************************************************************************/


import * as React from 'react';

import { i18n } from '../i18n';

import './fonts.css';


/**
 * Render the given SAN notation according to the given piece symbol style.
 *
 * @param {string|object} pieceSymbols See {@link moveFormatter}.
 * @param {string} notation SAN notation.
 * @returns {string|React.ReactFragment}
 */
export function formatMove(pieceSymbols, notation) {
	let formatter = moveFormatter(pieceSymbols);
	return formatter(notation);
}


/**
 * Return a callback capable of rendering a SAN notation using the given piece symbol style.
 *
 * @param {string|object} pieceSymbols `'native'`, `'localized'`, `'figurines'`, or an object defining a string-valued properties
 *                                     for each English piece symbol.
 * @returns {function(string)} Callback returning either a string or a React fragment.
 */
export function moveFormatter(pieceSymbols) {
	if (pieceSymbols === 'localized') {
		let mapping = i18n.PIECE_SYMBOLS;
		return notation => notation.replace(/[KQRBNP]/g, match => mapping[match]);
	}
	else if (pieceSymbols === 'figurines') {
		return notation => figurineNotation('alpha', notation);
	}
	else if (pieceSymbols !== 'native' && pieceSymbols && ['K', 'Q', 'R', 'B', 'N', 'P'].every(p => typeof pieceSymbols[p] === 'string')) {
		return notation => notation.replace(/[KQRBNP]/g, match => pieceSymbols[match]);
	}
	else {
		return notation => notation;
	}
}


/**
 * Decompose the given string into piece symbol characters and sections of non piece symbol characters, and transform the piece symbols into
 * React objects represented with the given chess font.
 *
 * @ignore
 */
function figurineNotation(fontName, text) {
	let result = [];
	let beginOfText = 0;
	let pieceSymbolIndex = 0;
	for (let pos = 0; pos < text.length; ++pos) {
		let currentChar = text.charAt(pos);
		if (currentChar === 'K' || currentChar === 'Q' || currentChar === 'R' || currentChar === 'B' || currentChar === 'N' || currentChar === 'P') {
			if (pos > beginOfText) {
				result.push(text.substring(beginOfText, pos));
			}
			beginOfText = pos + 1;
			let key = 'symbol-' + (pieceSymbolIndex++);
			result.push(<span className={'kokopu-font-' + fontName} key={key}>{currentChar}</span>);
		}
	}
	if (beginOfText < text.length) {
		result.push(text.substring(beginOfText));
	}
	return <>{result}</>;
}
