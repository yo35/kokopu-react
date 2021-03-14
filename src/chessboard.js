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


import PropTypes from 'prop-types';
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
 * Minimum square size (inclusive).
 */
export const MIN_SQUARE_SIZE = 12;

/**
 * Maximum square size (inclusive).
 */
export const MAX_SQUARE_SIZE = 96;


/**
 * Chessboard diagram.
 */
export default class Chessboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			draggedSquare: '-',
			hoveredSquare: '-',
		};
	}

	render() {

		// Compute the current position.
		let parseInfo = parsePosition(this.props.position);
		if (parseInfo.error) {
			return Chessboard.renderError(parseInfo.message);
		}
		let position = parseInfo.position;

		// Compute the annotations.
		let sqm = parseMarkers(this.props.squareMarkers, (result, token) => {
			if(/^([GRY])([a-h][1-8])$/.test(token)) {
				result[RegExp.$2] = RegExp.$1.toLowerCase();
			}
		});
		let txtm = parseMarkers(this.props.textMarkers, (result, token) => {
			if(/^([GRY])([A-Za-z0-9])([a-h][1-8])$/.test(token)) {
				result[RegExp.$3] = { color: RegExp.$1.toLowerCase(), text: RegExp.$2 };
			}
		});

		// Compute the attributes.
		let squareSize = this.getSquareSize();
		let coordinateVisible = this.isCoordinateVisible();
		let fontSize = computeCoordinateFontSize(squareSize);
		let colorset = this.getColorset();
		let pieceset = this.getPieceset();

		// Render squares and square-related objects.
		let squares = [];
		let pieces = [];
		let handles = [];
		let squareMarkers = [];
		let textMarkers = [];
		kokopu.forEachSquare(sq => {
			squares.push(this.renderSquare(squareSize, colorset, sq));
			pieces.push(this.renderPiece(position, squareSize, pieceset, sq));
			if (this.props.interactionMode) {
				handles.push(this.renderSquareHandle(squareSize, sq));
			}
			squareMarkers.push(this.renderSquareMarker(sqm, squareSize, colorset, sq));
			textMarkers.push(this.renderTextMarker(txtm, squareSize, colorset, sq));
		});

		// Render coordinates.
		let rankCoordinates = [];
		let fileCoordinates = [];
		if (coordinateVisible) {
			for (let c = 0; c < 8; ++c) {
				rankCoordinates.push(this.renderRankCoordinate(squareSize, fontSize, c));
				fileCoordinates.push(this.renderFileCoordinate(squareSize, fontSize, c));
			}
		}

		// Render the whole canvas.
		let xmin = coordinateVisible ? Math.round(-RANK_COORDINATE_WIDTH_FACTOR * fontSize) : 0;
		let ymin = 0;
		let xmax = 9 * squareSize + Math.round(TURN_FLAG_SPACING_FACTOR * squareSize);
		let ymax = 8 * squareSize + (coordinateVisible ? Math.round(FILE_COORDINATE_HEIGHT_FACTOR * fontSize) : 0);
		let viewBox = `${xmin} ${ymin} ${xmax - xmin} ${ymax - ymin}`;
		return (
			<svg className="kokopu-chessboard" viewBox={viewBox} width={xmax - xmin} height={ymax - ymin}>
				{squares}
				{squareMarkers}
				{this.renderHoveredSquare(squareSize, colorset)}
				{pieces}
				{textMarkers}
				{this.renderDraggedPiece(position, squareSize, pieceset)}
				{handles}
				{this.renderTurnFlag(position, squareSize, pieceset)}
				{rankCoordinates}
				{fileCoordinates}
			</svg>
		);
	}

	static renderError(message) {
		return <ErrorBox title="Error while analysing a FEN string." message={message}></ErrorBox>;
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
		return <rect className="kokopu-hoveredSquare" x={x + thickness/2} y={y + thickness/2} width={size} height={size} stroke={colorset.highlight} strokeWidth={thickness} />;
	}

	renderPiece(position, squareSize,  pieceset, sq) {
		let cp = position.square(sq);
		if (cp === '-' || this.state.draggedSquare === sq) {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		return <image key={'piece-' + sq} x={x} y={y} width={squareSize} height={squareSize} href={pieceset[cp]} />;
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

	renderSquareHandle(squareSize, sq) {
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		if (this.props.interactionMode === 'movePieces') {
			let dragPosition = this.state.draggedSquare === sq ? this.state.dragPosition : { x: 0, y: 0 };
			let bounds = { left: -x, top: -y, right: 7 * squareSize - x, bottom: 7 * squareSize - y };
			return (
				<Draggable
					key={'handle-' + sq} position={dragPosition} bounds={bounds}
					defaultClassName="kokopu-draggable" defaultClassNameDragging="kokopu-dragging"
					onStart={evt => this.handlePieceDragStart(sq, evt)}
					onDrag={(_, dragData) => this.handlePieceDrag(sq, dragData)}
					onStop={(_, dragData) => this.handlePieceDragStop(sq, dragData)}
				>
					<rect className="kokopu-handle" x={x} y={y} width={squareSize} height={squareSize} />
				</Draggable>
			);
		}
		else if (this.props.interactionMode === 'clickSquares') {
			return (
				<rect
					key={'handle-' + sq} className="kokopu-handle kokopu-clickable" x={x} y={y} width={squareSize} height={squareSize}
					onClick={() => this.handleSquareClicked(sq)}
				/>
			);
		}
		else {
			return undefined;
		}
	}

	renderSquareMarker(sqm, squareSize, colorset, sq) {
		let value = sqm[sq];
		if (!isValidAnnotationColor(value)) {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		return <rect key={'sqm-' + sq} x={x} y={y} className="kokopu-annotation" width={squareSize} height={squareSize} fill={colorset[value]} />;
	}

	renderTextMarker(txtm, squareSize, colorset, sq) {
		let value = txtm[sq];
		if (!value || !isValidAnnotationColor(value.color) || typeof value.text !== 'string') {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		x += squareSize / 2;
		y += squareSize / 2;
		if (/^[A-Za-z0-9]$/.test(value.text)) {
			return (
				<text key={'txtm-' + sq} className="kokopu-annotation kokopu-label" x={x} y={y} fill={colorset[value.color]} style={{ 'fontSize': squareSize }}>
					{value.text}
				</text>
			);
		}
		else {
			return undefined;
		}
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
		return <text key={'rank-' + label} className="kokopu-label" x={x} y={y} style={{ 'fontSize': fontSize }}>{label}</text>;
	}

	renderFileCoordinate(squareSize, fontSize, file) {
		let x = (this.props.isFlipped ? 7.5 - file : 0.5 + file) * squareSize;
		let y = 8 * squareSize + Math.round(FILE_COORDINATE_HEIGHT_FACTOR * fontSize) / 2;
		let label = FILE_LABELS[file];
		return <text key={'file-' + label} className="kokopu-label" x={x} y={y} style={{ 'fontSize': fontSize }}>{label}</text>;
	}

	handlePieceDragStart(sq, evt) {
		let squareBoundary = evt.target.getBoundingClientRect();
		this.setState({
			draggedSquare: sq,
			hoveredSquare: sq,
			cursorOffset: { x: evt.clientX - squareBoundary.left, y: evt.clientY - squareBoundary.top },
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

	handleSquareClicked(sq) {
		if (this.props.onSquareClicked) {
			this.props.onSquareClicked(sq);
		}
	}

	/**
	 * Return the (sanitized) square size.
	 */
	getSquareSize() {
		let value = Number(this.props.squareSize);
		return isNaN(value) ? 40 : Math.min(Math.max(Math.round(value), MIN_SQUARE_SIZE), MAX_SQUARE_SIZE);
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
		return colorsets[this.props.colorset in colorsets ? this.props.colorset : 'original'];
	}

	/**
	 * Return the (sanitized) pieceset.
	 */
	getPieceset() {
		return piecesets[this.props.pieceset in piecesets ? this.props.pieceset : 'cburnett'];
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
}


Chessboard.propTypes = {

	/**
	 * Displayed position, defined as a {@link kokopu.Position} or as a FEN string.
	 */
	position: PropTypes.oneOfType([
		PropTypes.instanceOf(kokopu.Position),
		PropTypes.string
	]),

	/**
	 * Square markers, defined as a "square -> color" struct (e.g. `{ e4: 'G', d5: 'R' }`) or as a comma-separated CSL string (e.g. `'Ge4,Rd5'`).
	 */
	squareMarkers: PropTypes.oneOfType([
		PropTypes.objectOf(PropTypes.string),
		PropTypes.string
	]),

	/**
	 * Text markers, defined as a "square -> (text, color)" struct (e.g. `{ e4: { text: 'A', color: 'G' }, d5: { text: 'z', color: 'R' }}`)
	 * or as a comma-separated CTL string (e.g. `'GAe4,Rzd5'`).
	 */
	textMarkers: PropTypes.oneOfType([
		PropTypes.objectOf(PropTypes.exact({ text: PropTypes.string.isRequired, color: PropTypes.string.isRequired })),
		PropTypes.string
	]),

	/**
	 * Whether the board is flipped (i.e. seen from Black's point of view) or not.
	 */
	isFlipped: PropTypes.bool,

	/**
	 * Size of the squares (in pixels). Must be between {@link MIN_SQUARE_SIZE} and {@link MAX_SQUARE_SIZE}.
	 */
	squareSize: PropTypes.number,

	/**
	 * Whether the row and column coordinates are visible or not.
	 */
	coordinateVisible: PropTypes.bool,

	/**
	 * Color theme ID.
	 */
	colorset: PropTypes.string,

	/**
	 * Piece theme ID.
	 */
	pieceset: PropTypes.string,

	/**
	 * Type of action allowed with the mouse on the chessboard.
	 */
	interactionMode: PropTypes.oneOf([ '', 'movePieces', 'clickSquares' ]),

	/**
	 * Callback invoked when a piece is moved through drag&drop (only if `interactionMode` is set to `'movePieces'`).
	 */
	onPieceMoved: PropTypes.func,

	/**
	 * Callback invoked when the user clicks on a square (only if `interactionMode` is set to `'clickSquares'`).
	 */
	onSquareClicked: PropTypes.func,
};


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
 * Whether the given value is a valid color code for an annotation.
 *
 * @param {string} value
 * @returns {boolean}
 */
function isValidAnnotationColor(value) {
	return value === 'g' || value === 'r' || value === 'y';
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


/**
 * Try to interpret the given object as a list of markers.
 *
 * @param {*} markers
 * @param {callback} callback
 * @returns {object}
 */
function parseMarkers(markers, callback) {
	if (typeof markers === 'string') {
		let result = {};
		markers.split(',').forEach(token => callback(result, token.trim()));
		return result;
	}
	else if (typeof markers === 'object') {
		return markers;
	}
	else {
		return {};
	}
}
