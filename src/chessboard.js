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
import Draggable from 'react-draggable';
import kokopu from 'kokopu';

import ErrorBox from './error_box';
import colorsets from './colorsets';
import piecesets from './piecesets';

import './chessboard.css';

const TURN_FLAG_SPACING_FACTOR = 0.1;
const RANK_COORDINATE_WIDTH_FACTOR = 1;
const FILE_COORDINATE_HEIGHT_FACTOR = 1.4;
const HOVER_MARKER_THICKNESS_FACTOR = 0.1;

const RANK_LABELS = '12345678';
const FILE_LABELS = 'abcdefgh';


/**
 * Chessboard diagram.
 */
export default class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			draggedSquare: '-',
			hoveredSquare: '-',
		};
	}

	render() {
		let parseInfo = parsePosition(this.props.position);
		if (parseInfo.error) {
			return this.renderError(parseInfo.message);
		}

		let position = parseInfo.position;
		let squareSize = this.getSquareSize();
		let coordinateVisible = this.isCoordinateVisible();
		let fontSize = computeCoordinateFontSize(squareSize);
		let colorset = this.getColorset();
		let pieceset = this.getPieceset();

		let squares = [];
		let pieces = [];
		kokopu.forEachSquare(sq => {
			squares.push(this.renderSquare(squareSize, colorset, sq));
			pieces.push(this.renderPiece(position, squareSize, pieceset, sq));
		});

		let rankCoordinates = [];
		let fileCoordinates = [];
		if (coordinateVisible) {
			for (let c = 0; c < 8; ++c) {
				rankCoordinates.push(this.renderRankCoordinate(squareSize, fontSize, c));
				fileCoordinates.push(this.renderFileCoordinate(squareSize, fontSize, c));
			}
		}

		let xmin = coordinateVisible ? Math.round(-RANK_COORDINATE_WIDTH_FACTOR * fontSize) : 0;
		let ymin = 0;
		let xmax = 9 * squareSize + Math.round(TURN_FLAG_SPACING_FACTOR * squareSize);
		let ymax = 8 * squareSize + (coordinateVisible ? Math.round(FILE_COORDINATE_HEIGHT_FACTOR * fontSize) : 0);
		let viewBox = xmin + ' ' + ymin + ' ' + (xmax - xmin) + ' ' + (ymax - ymin);
		return (
			<svg className="kokopu-chessboard" viewBox={viewBox} width={xmax - xmin} height={ymax - ymin}>
				{squares}
				{this.renderHoveredSquare(squareSize, colorset)}
				{pieces}
				{this.renderTurnFlag(position, squareSize, pieceset)}
				{this.renderDraggedPiece(position, squareSize, pieceset)}
				{rankCoordinates}
				{fileCoordinates}
			</svg>
		);
	}

	renderError(message) {
		return <ErrorBox title="Error while analysing a FEN string." message={message}></ErrorBox>
	}

	renderSquare(squareSize, colorset, sq) {
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		return <rect key={sq} x={x} y={y} width={squareSize} height={squareSize} fill={colorset[kokopu.squareColor(sq)]} />;
	}

	renderHoveredSquare(squareSize, colorset) {
		if (this.state.hoveredSquare === '-') {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(squareSize, this.state.hoveredSquare);
		let thickness = Math.max(2, Math.round(HOVER_MARKER_THICKNESS_FACTOR * squareSize));
		let size = squareSize - thickness;
		return <rect x={x + thickness/2} y={y + thickness/2} width={size} height={size} fill="transparent" stroke={colorset.s} strokeWidth={thickness} />;
	}

	renderPiece(position, squareSize,  pieceset, sq) {
		let cp = position.square(sq);
		if (cp === '-') {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		if (this.props.interactionMode === 'movePieces') {
			let bounds = { left: -x, top: -y, right: 7 * squareSize - x, bottom: 7 * squareSize - y };
			return (
				<Draggable key={'piece-' + sq} position={this.getDragPosition(sq)} bounds={bounds}
					defaultClassName="kokopu-draggable" defaultClassNameDragging="kokopu-dragging"
					onStart={event => this.handlePieceDragStart(sq, event)}
					onDrag={(_, dragData) => this.handlePieceDrag(sq, dragData)}
					onStop={(_, dragData) => this.handlePieceDragStop(sq, dragData)}
				>
					<image x={x} y={y} width={squareSize} height={squareSize} href={pieceset[cp]} />
				</Draggable>
			);
		}
		else {
			return <image key={'piece-' + sq} x={x} y={y} width={squareSize} height={squareSize} href={pieceset[cp]} />;
		}
	}

	renderDraggedPiece(position, squareSize, pieceset) {
		if (this.state.draggedSquare === '-') {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(squareSize, this.state.draggedSquare);
		let cp = position.square(this.state.draggedSquare);
		return (
			<image
				className="kokopu-draggable kokopu-dragging"
				x={x + this.state.dragPosition.x} y={y + this.state.dragPosition.y} width={squareSize} height={squareSize} href={pieceset[cp]}
			/>
		);
	}

	renderTurnFlag(position, squareSize, pieceset) {
		let turn = position.turn();
		let x = 8 * squareSize + Math.round(TURN_FLAG_SPACING_FACTOR * squareSize);
		let y = (turn === 'w') === this.props.isFlipped ? 0 : 7 * squareSize;
		return <image x={x} y={y} width={squareSize} height={squareSize} href={pieceset[turn + 'x']} />;
	}

	renderRankCoordinate(squareSize, fontSize, rank) {
		let x = Math.round(-RANK_COORDINATE_WIDTH_FACTOR * fontSize) / 2;
		let y = (this.props.isFlipped ? rank + 0.5 : 7.5 - rank) * squareSize;
		let label = RANK_LABELS[rank];
		return <text key={'rank-' + label} className="kokopu-rankCoordinate" x={x} y={y} style={{ 'fontSize': fontSize }}>{label}</text>
	}

	renderFileCoordinate(squareSize, fontSize, file) {
		let x = (this.props.isFlipped ? 7.5 - file : 0.5 + file) * squareSize;
		let y = 8 * squareSize + Math.round(FILE_COORDINATE_HEIGHT_FACTOR * fontSize) / 2;
		let label = FILE_LABELS[file];
		return <text key={'file-' + label} className="kokopu-fileCoordinate" x={x} y={y} style={{ 'fontSize': fontSize }}>{label}</text>
	}

	handlePieceDragStart(sq, event) {
		let squareBoundary = event.target.getBoundingClientRect();
		this.setState({
			draggedSquare: sq,
			hoveredSquare: sq,
			cursorOffset: { x: event.clientX - squareBoundary.left, y: event.clientY - squareBoundary.top },
			dragPosition: { x: 0, y: 0 },
		});
	}

	handlePieceDrag(sq, dragData) {
		let squareSize = this.getSquareSize();
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		let targetSq = this.getSquareAt(squareSize, x + dragData.x + this.state.cursorOffset.x, y + dragData.y + this.state.cursorOffset.y);
		this.setState({
			draggedSquare: sq,
			hoveredSquare: targetSq,
			cursorOffset: this.state.cursorOffset,
			dragPosition: { x: dragData.x, y: dragData.y },
		});
	}

	handlePieceDragStop(sq, dragData) {
		let squareSize = this.getSquareSize();
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		let targetSq = this.getSquareAt(squareSize, x + dragData.x + this.state.cursorOffset.x, y + dragData.y + this.state.cursorOffset.y);
		this.setState({
			draggedSquare: '-',
			hoveredSquare: '-',
		});
		if (sq !== targetSq && this.props.onPieceMoved) {
			this.props.onPieceMoved(sq, targetSq);
		}
	}

	/**
	 * Return the (sanitized) square size.
	 */
	getSquareSize() {
		let value = Number(this.props.squareSize);
		return isNaN(value) ? 40 : Math.min(Math.max(Math.round(value), 12), 64);
	}

	/**
	 * Whether the file/rank coordinates are visible or not.
	 */
	isCoordinateVisible() {
		return 'coordinateVisible' in this.props ? this.props.coordinateVisible : true;
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

	/**
	 * Return the (x,y) coordinates of the given square in the SVG canvas.
	 */
	getSquareCoordinates(squareSize, sq) {
		let { file, rank } = kokopu.squareToCoordinates(sq);
		let x = this.props.isFlipped ? (7 - file) * squareSize : file * squareSize;
		let y = this.props.isFlipped ? rank * squareSize : (7 - rank) * squareSize;
		return { x: x, y: y };
	}

	/**
	 * Return the square at the given location.
	 */
	getSquareAt(squareSize, x, y) {
		let file = this.props.isFlipped ? 7 - Math.floor(x / squareSize) : Math.floor(x / squareSize);
		let rank = this.props.isFlipped ? Math.floor(y / squareSize) : 7 - Math.floor(y / squareSize);
		return file >= 0 && file < 8 && rank >= 0 && rank < 8 ? kokopu.coordinatesToSquare(file, rank) : '-';
	}

	/**
	 * Return the drag position of the piece in the given square.
	 */
	getDragPosition(sq) {
		return this.state.draggedSquare === sq ? this.state.dragPosition : { x: 0, y: 0 };
	}
}


/**
 * Return the font size to use for coordinates assuming the given square size.
 *
 * @param {number}
 * @returns {number}
 */
function computeCoordinateFontSize(squareSize) {
	return squareSize <= 32 ? 8 : 8 + (squareSize - 32) * 0.2;
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
