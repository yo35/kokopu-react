/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2022  Yoann Le Montagner <yo35 -at- melix.net>       *
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

import '../css/label.css';
import '../css/symbol.css';

const SHAPE_THICKNESS_FACTOR = 0.1;
const DOT_RADIUS_FACTOR = 0.15;
const CIRCLE_RADIUS_FACTOR = 0.425;


/**
 * Symbol of a text marker.
 */
export default function TextSymbol(props) {
	if (props.symbol === 'dot') {
		return <circle cx={props.x} cy={props.y} r={props.size * DOT_RADIUS_FACTOR} fill={props.color} />;
	}
	else if (props.symbol === 'circle') {
		let thickness = props.size * SHAPE_THICKNESS_FACTOR;
		return <circle className="kokopu-symbolCircle" cx={props.x} cy={props.y} r={props.size * CIRCLE_RADIUS_FACTOR} stroke={props.color} strokeWidth={thickness} />;
	}
	else {
		let symbol = props.symbol === 'plus' ? '+' : props.symbol === 'times' ? '\u00d7' : props.symbol;
		return <text className="kokopu-label" x={props.x} y={props.y} fill={props.color} fontSize={props.size}>{symbol}</text>;
	}
}

TextSymbol.propTypes = {

	/**
	 * X-coordinate of the center of the symbol.
	 */
	x: PropTypes.number.isRequired,

	/**
	 * Y-coordinate of the center of the symbol.
	 */
	y: PropTypes.number.isRequired,

	/**
	 * Size of the symbol (i.e. size of square in which the symbol is rendered).
	 */
	size: PropTypes.number.isRequired,

	/**
	 * Symbol code.
	 */
	symbol: PropTypes.string.isRequired,

	/**
	 * Color to use to colorize the shape (for example: `'green'`, `'#ff0000'`...).
	 */
	color: PropTypes.string.isRequired,
};
