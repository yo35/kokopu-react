/******************************************************************************
 *                                                                            *
 *    This file is part of KokopuReact, a JavaScript chess library.           *
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

export default function(props) {
	let colorClassName = props.color === 'w' ? 'kokopu-lightSquare' : 'kokopu-darkSquare';
	let squareContent = props.cp === '-' ? <></> : renderColoredPiece(props.cp);
	return (
		<div className={['kokopu-boardCell', 'kokopu-square', 'kokopu-sized', colorClassName].join(' ')}>
			{squareContent}
		</div>
	);
}

function renderColoredPiece(coloredPiece) {
	let coloredPieceClassName = 'kokopu-piece-' + coloredPiece;
	return <div className={['kokopu-piece', 'kokopu-sized', coloredPieceClassName].join(' ')}></div>;
}
