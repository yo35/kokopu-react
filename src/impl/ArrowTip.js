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


/**
 * Tip of the arrow markers.
 */
export default function ArrowTip(props) {
	return (
		<marker id={props.id} markerWidth={4} markerHeight={4} refX={2.5} refY={2} orient="auto">
			<path fill={props.color} d="M 4,2 L 0,4 L 1,2 L 0,0 Z" />
		</marker>
	);
}

ArrowTip.propTypes = {

	/**
	 * ID of the element.
	 */
	id: PropTypes.string.isRequired,

	/**
	 * Color to use to colorize the shape (for example: `'green'`, `'#ff0000'`...).
	 */
	color: PropTypes.string.isRequired,
};
