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

import { MIN_SQUARE_SIZE, MAX_SQUARE_SIZE } from './constants';
import { sanitizeInteger } from './impl/validation';

const SQUARE_MARGIN_FACTOR = 0.1;


/**
 * SVG icon representing a square marker.
 *
 * @component
 */
export default function SquareMarkerIcon(props) {
	let size = sanitizeInteger(props.size, NaN, MIN_SQUARE_SIZE, MAX_SQUARE_SIZE);
	if (isNaN(size)) {
		return undefined;
	}
	let margin = Math.round(size * SQUARE_MARGIN_FACTOR);
	let viewBox = `0 0 ${size} ${size}`;
	return (
		<svg className="kokopu-squareMarkerIcon" viewBox={viewBox} width={size} height={size}>
			<rect x={margin} y={margin} width={size - margin*2} height={size - margin*2} fill={props.color} />
		</svg>
	);
}

SquareMarkerIcon.propTypes = {

	/**
	 * Width and height (in pixels) of the icon.
	 */
	size: PropTypes.number.isRequired,

	/**
	 * Color to use to colorize the icon (for example: `'green'`, `'#ff0000'`...).
	 */
	color: PropTypes.string,
};

SquareMarkerIcon.defaultProps = {
	color: 'currentcolor',
};
