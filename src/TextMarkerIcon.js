/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021  Yoann Le Montagner <yo35 -at- melix.net>            *
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

import { MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, sanitizeInteger, isValidSymbol } from './impl/util';
import TextSymbol from './impl/TextSymbol';


/**
 * SVG icon representing a text marker.
 */
export default function TextMarkerIcon(props) {
	let size = sanitizeInteger(props.size, MIN_SQUARE_SIZE, MAX_SQUARE_SIZE);
	if (isNaN(size) || !isValidSymbol(props.symbol)) {
		return undefined;
	}
	let viewBox = `0 0 ${size} ${size}`;
	return (
		<svg className="kokopu-textMarkerIcon" viewBox={viewBox} width={size} height={size}>
			<TextSymbol x={size / 2} y={size / 2} size={size} symbol={props.symbol} color={props.color} />
		</svg>
	);
}

TextMarkerIcon.propTypes = {

	/**
	 * Width and height (in pixels) of the icon.
	 */
	size: PropTypes.number.isRequired,

	/**
	 * Symbol to represent on the icon. Must be one of:
	 *  - any letter from A to Z (either upper-case or lower-case),
	 *  - any digit from 0 to 9,
	 *  - any symbol code among `'plus'`, `'times'`, `'dot'`, or `'circle'`.
	 */
	symbol: PropTypes.string.isRequired,

	/**
	 * Color to use to colorize the icon (for example: `'green'`, `'#ff0000'`...).
	 */
	color: PropTypes.string,
};

TextMarkerIcon.defaultProps = {
	color: 'currentcolor',
};
