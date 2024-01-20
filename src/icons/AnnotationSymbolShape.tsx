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

import { AnnotationSymbol } from '../types';

import './AnnotationSymbolShape.css';

const SHAPE_THICKNESS_FACTOR = 0.1;
const DOT_RADIUS_FACTOR = 0.15;
const CIRCLE_RADIUS_FACTOR = 0.425;


interface AnnotationSymbolShapeProps {

	/**
	 * X-coordinate of the center of the symbol.
	 */
	x: number;

	/**
	 * Y-coordinate of the center of the symbol.
	 */
	y: number;

	/**
	 * Size of the symbol (i.e. size of square in which the symbol is rendered).
	 */
	size: number;

	/**
	 * Symbol code.
	 */
	symbol: AnnotationSymbol;

	/**
	 * [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) to use to colorize the shape (for example: `'green'`, `'#ff0000'`...).
	 */
	color: string;
}


/**
 * Symbol of a text marker.
 */
export function AnnotationSymbolShape({ x, y, size, symbol, color }: AnnotationSymbolShapeProps) {
	if (symbol === 'dot') {
		return <circle cx={x} cy={y} r={size * DOT_RADIUS_FACTOR} fill={color} />;
	}
	else if (symbol === 'circle') {
		const thickness = size * SHAPE_THICKNESS_FACTOR;
		return <circle className="kokopu-symbolCircle" cx={x} cy={y} r={size * CIRCLE_RADIUS_FACTOR} stroke={color} strokeWidth={thickness} />;
	}
	else {
		const text = symbol === 'plus' ? '+' : symbol === 'times' ? '\u00d7' : symbol;
		return <text className="kokopu-symbolText" x={x} y={y} fill={color} fontSize={size}>{text}</text>;
	}
}
