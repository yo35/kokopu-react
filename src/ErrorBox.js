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

import './css/error_box.css';


/**
 * Display an error message.
 */
export default function ErrorBox(props) {
	return (
		<div className="kokopu-errorBox">
			<div className="kokopu-errorTitle">{props.title}</div>
			<div className="kokopu-errorMessage">{props.message}</div>
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
};
