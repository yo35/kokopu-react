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


import PropTypes from 'prop-types';
import React from 'react';

import i18n from './i18n';
import { fillPlaceholder } from './impl/util';

import './css/error_box.css';

const BACKWARD_CHARACTERS = 5;
const FORWARD_CHARACTERS = 36;



/**
 * Display an error message.
 */
export default function ErrorBox(props) {
	let excerpt = typeof props.text === 'string' && props.errorIndex >= 0 && props.errorIndex < props.text.length ?
		<div className="kokopu-errorExcerpt">{ellipsisAt(props.text, props.errorIndex, BACKWARD_CHARACTERS, FORWARD_CHARACTERS, props.lineNumber)}</div> : undefined;
	return (
		<div className="kokopu-errorBox">
			<div className="kokopu-errorTitle">{props.title}</div>
			<div className="kokopu-errorMessage">{props.message}</div>
			{excerpt}
		</div>
	);
}


ErrorBox.propTypes = {

	/**
	 * Title of the error box.
	 */
	title: PropTypes.string.isRequired,

	/**
	 * Additional message providing details about the error.
	 */
	message: PropTypes.string.isRequired,

	/**
	 * Raw text whose processing results in the error.
	 */
	text: PropTypes.string,

	/**
	 * Index of the character within `text` that results in the error.
	 */
	errorIndex: PropTypes.number,

	/**
	 * Index (1-based) of the line in which is the character that results in the error.
	 */
	lineNumber: PropTypes.number,
};


/**
 * Ellipsis function.
 *
 * Example: if `text` is `0123456789`, then `ellipsis(text, 5, 1, 3)` returns
 * the following string:
 *
 * ```
 * ...45678...
 *     ^
 * ```
 *
 * @param {string} text Text from a substring must be extracted.
 * @param {number} pos Index of the character in `text` around which the substring must be extracted.
 * @param {number} backwardCharacters Number of characters to keep before `pos`.
 * @param {number} forwardCharacters Number of characters to keep after `pos`.
 * @returns {string}
 */
function ellipsisAt(text, pos, backwardCharacters, forwardCharacters, lineNumber) {

	// p1 => begin of the extracted sub-string
	let p1 = pos;
	let e1 = '... ';
	while (p1 > pos - backwardCharacters) {
		--p1;
		if (p1 < 0 || text.charAt(p1) === '\n' || text.charAt(p1) === '\r') {
			++p1;
			e1 = '';
			break;
		}
	}

	// p2 => one character after the end of the extracted sub-string
	let p2 = pos;
	let e2 = ' ...';
	while (p2 < pos + forwardCharacters) {
		++p2;
		if (p2 >= text.length || text.charAt(p2) === '\n' || text.charAt(p2) === '\r') {
			--p2;
			e2 = '';
			break;
		}
	}

	// Extract the sub-string around the requested position.
	let excerpt = e1 + text.substring(p1, p2 + 1) + e2;
	excerpt = excerpt.replace(/\n|\r|\t/g, ' ');
	let secondLine = Array(1 + e1.length + pos - p1).join(' ') + '^';
	if (lineNumber) {
		secondLine += ` (${fillPlaceholder(i18n.LINE, lineNumber)})`;
	}
	return excerpt + '\n' + secondLine;
}
