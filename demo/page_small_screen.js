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


import React from 'react';

import { Chessboard } from '../src/index';

import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';


export const initialStateSmallScreen = {};


export class PageSmallScreen extends React.Component {

	render() {
		let limits = [
			{ width: 470, squareSize: 12, coordinateVisible: false },
			{ width: 540, squareSize: 16, coordinateVisible: false },
			{ width: 620, squareSize: 24, coordinateVisible: false },
			{ width: 730, squareSize: 32 },
			{ width: 860, squareSize: 44 },
		];
		return (
			<div>
				<Box m={2}>
					<Alert severity="info">Resize the browser to see the chessboard adapt its size...</Alert>
				</Box>
				<Box m={2}>
					<Chessboard squareSize={56} smallScreenLimits={limits} />
				</Box>
			</div>
		);
	}
}
