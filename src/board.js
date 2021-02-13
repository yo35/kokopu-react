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
import kokopu from 'kokopu';

import ErrorBox from './error_box';
import Square from './square';

export default class extends React.Component {

	render() {
		let parseInfo = parsePosition(this.props.position);
		if(parseInfo.error) {
			return this.renderError(parseInfo.message);
		}

		let position = parseInfo.position;
		let rows = this.getRowIds().map(r => this.renderRow(position, r));
		let columnCoordinates = this.getColumnIds().map(c => this.renderColumnCoordinate(c));

		let sizeClassName = 'kokopu-size' + ('squareSize' in this.props ? this.props.squareSize : 40);
		let coordinateVisibleClassName = ('coordinateVisible' in this.props && !this.props.coordinateVisible ? 'kokopu-hideCoordinates' : '');
		return (
			<div className={['kokopu-board', sizeClassName, coordinateVisibleClassName].join(' ')}>
				{rows}
				<div className="kokopu-boardRow kokopu-columnCoordinates">
					<div className="kokopu-boardCell"></div>
					{columnCoordinates}
					<div className="kokopu-boardCell"></div>
				</div>
			</div>
		);
	}

	renderError(message) {
		return <ErrorBox title="Error while analysing a FEN string." message={message}></ErrorBox>
	}

	renderRow(position, r) {
		let squares = this.getColumnIds().map(c => this.renderSquare(position, r, c));
		let turnFlag = this.renderTurnFlag(position, r);
		return (
			<div key={r} className="kokopu-boardRow">
				<div className="kokopu-boardCell kokopu-rowCoordinate">{r}</div>
				{squares}
				<div className="kokopu-boardCell">{turnFlag}</div>
			</div>
		);
	}

	renderSquare(position, r, c) {
		let sq = c + r;
		return <Square key={sq} color={kokopu.squareColor(sq)} cp={position.square(sq)} />;
	}

	renderTurnFlag(position, r) {
		if(r === '1' || r === '8') {
			let color = r === '1' ? 'w' : 'b';
			let colorClassName = 'kokopu-flag-' + color;
			let visibilityClassName = position.turn() === color ? '' : 'kokopu-inactiveFlag';
			return <div className={['kokopu-flag', 'kokopu-sized', colorClassName, visibilityClassName].join(' ')}></div>
		}
		else {
			return <></>;
		}
	}

	renderColumnCoordinate(c) {
		return <div key={c} className="kokopu-boardCell kokopu-columnCoordinate">{c}</div>;
	}

	getRowIds() {
		return [...(this.props.isFlipped ? '12345678' : '87654321')];
	}

	getColumnIds() {
		return [...(this.props.isFlipped ? 'hgfedcba' : 'abcdefgh')];
	}
}

/**
 * Try to interpret the given object as a chess position.
 *
 * @param {*} position
 * @returns {({error:false, position:kokopu.Position}|{error:true, message:string})}
 */
function parsePosition(position) {
	if(position instanceof kokopu.Position) {
		return {
			error: false,
			position: position
		};
	}
	else {
		try {
			return {
				error: false,
				position: new kokopu.Position(position)
			};
		}
		catch(e) {
			if(e instanceof kokopu.exception.InvalidFEN) {
				return {
					error: true,
					message: e.message
				};
			}
			else {
				throw e;
			}
		}
	}
}
