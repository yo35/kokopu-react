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

import './css/arrow.css';

import { MIN_SQUARE_SIZE, MAX_SQUARE_SIZE } from './constants';
import { sanitizeInteger } from './impl/validation';
import { generateRandomId } from './impl/util';
import ArrowTip from './impl/ArrowTip';

const ARROW_THICKNESS_FACTOR = 0.2;


/**
 * SVG icon representing an arrow marker.
 */
export default class ArrowMarkerIcon extends React.Component {

	constructor(props) {
		super(props);
		this.arrowTipId = generateRandomId();
	}

	render() {
		let size = sanitizeInteger(this.props.size, NaN, MIN_SQUARE_SIZE, MAX_SQUARE_SIZE);
		if (isNaN(size)) {
			return undefined;
		}
		let halfThickness = size / 2 - Math.round(size * (1 - ARROW_THICKNESS_FACTOR) / 2);
		let viewBox = `0 0 ${size} ${size}`;
		return (
			<svg className="kokopu-arrowMarkerIcon" viewBox={viewBox} width={size} height={size}>
				<defs>
					<ArrowTip id={this.arrowTipId} color={this.props.color} />
				</defs>
				<line className="kokopu-arrow" x1={halfThickness} y1={size / 2} x2={size - halfThickness * 3} y2={size / 2} stroke={this.props.color}
					style={{ 'strokeWidth': halfThickness * 2, 'markerEnd': `url(#${this.arrowTipId})` }} />
			</svg>
		);
	}
}

ArrowMarkerIcon.propTypes = {

	/**
	 * Width and height (in pixels) of the icon.
	 */
	size: PropTypes.number.isRequired,

	/**
	 * Color to use to colorize the icon (for example: `'green'`, `'#ff0000'`...).
	 */
	color: PropTypes.string,
};

ArrowMarkerIcon.defaultProps = {
	color: 'currentcolor',
};
