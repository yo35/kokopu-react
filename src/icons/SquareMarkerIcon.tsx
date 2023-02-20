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


import * as React from 'react';

import { IllegalArgument } from '../exception';
import { sanitizeString, sanitizeBoundedInteger } from '../sanitization';
import { MIN_SQUARE_SIZE, MAX_SQUARE_SIZE } from '../types';

const SQUARE_MARGIN_FACTOR = 0.1;


export interface SquareMarkerIconProps {

	/**
	 * Width and height (in pixels) of the icon.
	 */
	size: number;

	/**
	 * [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) to use to colorize the icon (for example: `'green'`, `'#ff0000'`...).
	 */
	color: string;
}


const defaultProps: Partial<SquareMarkerIconProps> = {
	color: 'currentcolor',
};


/**
 * SVG icon representing a square marker.
 */
export function SquareMarkerIcon({ size, color }: SquareMarkerIconProps) {

	// Sanitize the inputs.
	size = sanitizeBoundedInteger(size, MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, () => new IllegalArgument('SquareMarkerIcon'));
	color = sanitizeString(color);

	// Render the component.
	const margin = Math.round(size * SQUARE_MARGIN_FACTOR);
	const viewBox = `0 0 ${size} ${size}`;
	return (
		<svg className="kokopu-squareMarkerIcon" viewBox={viewBox} width={size} height={size}>
			<rect x={margin} y={margin} width={size - margin * 2} height={size - margin * 2} fill={color} />
		</svg>
	);
}

SquareMarkerIcon.defaultProps = defaultProps;
