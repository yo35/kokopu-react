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
import colorsets from './colorsets';
import piecesets from './piecesets';

import './chessboard.css';

const TURN_FLAG_SPACING = 0.1;
const RANK_COORDINATE_WIDTH = 0.25;
const FILE_COORDINATE_HEIGHT = 0.35;

const RANK_LABELS = '12345678';
const FILE_LABELS = 'abcdefgh';

export default class extends React.Component {

	render() {
		let parseInfo = parsePosition(this.props.position);
		if (parseInfo.error) {
			return this.renderError(parseInfo.message);
		}

		let position = parseInfo.position;
		let squareSize = this.getSquareSize();
		let colorset = this.getColorset();
		let pieceset = this.getPieceset();
		let xmin = this.props.coordinateVisible ? -RANK_COORDINATE_WIDTH : 0;
		let ymin = 0;
		let xmax = 9 + TURN_FLAG_SPACING;
		let ymax = 8 + (this.props.coordinateVisible ? FILE_COORDINATE_HEIGHT : 0);
		let viewBox = xmin + ' ' + ymin + ' ' + xmax + ' ' + ymax;

		let squares = [];
		let pieces = [];
		kokopu.forEachSquare(sq => this.renderSquare(position, colorset, pieceset, sq, squares, pieces));

		let rankCoordinates = [];
		let fileCoordinates = [];
		if (this.props.coordinateVisible) {
			for (let c = 0; c < 8; ++c) {
				rankCoordinates.push(this.renderRankCoordinate(c));
				fileCoordinates.push(this.renderFileCoordinate(c));
			}
		}

		return (
			<svg className="kokopu-chessboard" viewBox={viewBox} width={squareSize * (xmax - xmin)} height={squareSize * (ymax - ymin)}>
				{squares}
				{pieces}
				{this.renderTurnFlag(position, pieceset)}
				{rankCoordinates}
				{fileCoordinates}
			</svg>
		);
	}

	renderError(message) {
		return <ErrorBox title="Error while analysing a FEN string." message={message}></ErrorBox>
	}

	renderSquare(position, colorset, pieceset, sq, squares, pieces) {
		let { file, rank } = kokopu.squareToCoordinates(sq);
		let x = this.props.isFlipped ? 7 - file : file;
		let y = this.props.isFlipped ? rank : 7 - rank;
		let cp = position.square(sq);
		squares.push(<rect key={sq} x={x} y={y} width={1} height={1} fill={colorset[kokopu.squareColor(sq)]} />);
		if (cp !== '-') {
			pieces.push(<image key={'piece-' + sq} x={x} y={y} width={1} height={1} href={pieceset[cp]} />);
		}
	}

	renderTurnFlag(position, pieceset) {
		let turn = position.turn();
		let x = 8 + TURN_FLAG_SPACING;
		let y = (turn === 'w') === this.props.isFlipped ? 0 : 7;
		return <image x={x} y={y} width={1} height={1} href={pieceset[turn + 'x']} />;
	}

	renderRankCoordinate(rank) {
		let x = -RANK_COORDINATE_WIDTH / 2;
		let y = this.props.isFlipped ? rank + 0.5 : 7.5 - rank;
		let label = RANK_LABELS[rank];
		return <text key={'rank-' + label} className="kokopu-rankCoordinate" x={x} y={y}>{label}</text>
	}

	renderFileCoordinate(file) {
		let x = this.props.isFlipped ? 7.5 - file : 0.5 + file;
		let y = 8 + FILE_COORDINATE_HEIGHT / 2;
		let label = FILE_LABELS[file];
		return <text key={'file-' + label} className="kokopu-fileCoordinate" x={x} y={y}>{label}</text>
	}

	/**
	 * Return the (sanitized) square size.
	 */
	getSquareSize() {
		let value = Number(this.props.squareSize);
		return isNaN(value) ? 40 : Math.min(Math.max(value, 12), 64);
	}

	/**
	 * Return the (sanitized) colorset.
	 */
	getColorset() {
		return colorsets['original']; // TODO plug colorset
	}

	/**
	 * Return the (sanitized) pieceset.
	 */
	getPieceset() {
		return piecesets['cburnett']; // TODO plug pieceset
	}
}

/**
 * Try to interpret the given object as a chess position.
 *
 * @param {*} position
 * @returns {({error:false, position:kokopu.Position}|{error:true, message:string})}
 */
function parsePosition(position) {
	if (position instanceof kokopu.Position) {
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
		catch (e) {
			if (e instanceof kokopu.exception.InvalidFEN) {
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
