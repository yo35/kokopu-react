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
import Draggable from 'react-draggable';
import { Motion, spring } from 'react-motion';
import kokopu from 'kokopu';

import ErrorBox from './error_box';
import colorsets from './colorsets';
import piecesets from './piecesets';
import { sanitizeBoolean } from './util';

import './chessboard.css';

const TURN_FLAG_SPACING_FACTOR = 0.1;
const RANK_COORDINATE_WIDTH_FACTOR = 1;
const FILE_COORDINATE_HEIGHT_FACTOR = 1.4;
const HOVER_MARKER_THICKNESS_FACTOR = 0.1;
const STROKE_THICKNESS_FACTOR = 0.15;
const ARROW_TIP_OFFSET_FACTOR = 0.3;

const ANIMATION_SPEED = { stiffness: 700, damping: 40 };

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
		this.arrowTipIdSuffix = generateRandomId();
	}

	render() {

		// Compute the current position.
		let parseInfo = parsePosition(this.props.position);
		if (parseInfo.error) {
			return <ErrorBox title="Error while analysing a FEN string." message={parseInfo.message}></ErrorBox>;
		}
		let position = parseInfo.position;
		let move = null;
		let positionBefore = null;
		if (this.props.move) {
			parseInfo = parseMove(position, this.props.move);
			if (parseInfo.error) {
				return <ErrorBox title="Invalid move notation." message={parseInfo.message}></ErrorBox>;
			}
			move = parseInfo.move;
			positionBefore = position;
			position = new kokopu.Position(position);
			position.play(move);
		}

		// Compute the attributes.
		let isFlipped = this.isFlipped();
		let squareSize = this.getSquareSize();
		let coordinateVisible = this.isCoordinateVisible();
		let fontSize = computeCoordinateFontSize(squareSize);
		let colorset = this.getColorset();
		let pieceset = this.getPieceset();

		// Render the squares.
		let squares = [];
		kokopu.forEachSquare(sq => squares.push(this.renderSquare(isFlipped, squareSize, colorset, sq)));

		// Render coordinates.
		let rankCoordinates = [];
		let fileCoordinates = [];
		if (coordinateVisible) {
			for (let c = 0; c < 8; ++c) {
				rankCoordinates.push(this.renderRankCoordinate(isFlipped, squareSize, fontSize, c));
				fileCoordinates.push(this.renderFileCoordinate(isFlipped, squareSize, fontSize, c));
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
				<defs>
					{this.renderArrowTip(colorset, 'g')}
					{this.renderArrowTip(colorset, 'r')}
					{this.renderArrowTip(colorset, 'y')}
					{this.renderArrowTip(colorset, 'highlight')}
				</defs>
				{squares}
				{rankCoordinates}
				{fileCoordinates}
				{this.renderBoardContent(position, positionBefore, move, isFlipped, squareSize, colorset, pieceset)}
			</svg>
		);
	}

	renderBoardContent(position, positionBefore, move, isFlipped, squareSize, colorset, pieceset) {
		if (move && this.isAnimated()) {
			return (
				<Motion key={move.toString()} defaultStyle={{ alpha: 0 }} style={{ alpha: spring(1, ANIMATION_SPEED) }}>
					{currentStyle => (currentStyle.alpha >= 1 ? this.renderBoardContentStill(position, move, isFlipped, squareSize, colorset, pieceset)
						: this.renderBoardContentAnimated(positionBefore, move, currentStyle.alpha, isFlipped, squareSize, colorset, pieceset))}
				</Motion>
			);
		}
		else {
			return this.renderBoardContentStill(position, move, isFlipped, squareSize, colorset, pieceset);
		}
	}

	/**
	 * Render the board content during the animation.
	 */
	renderBoardContentAnimated(positionBefore, move, alpha, isFlipped, squareSize, colorset, pieceset) {
		let pieces = [];
		kokopu.forEachSquare(sq => pieces.push(this.renderPieceAnimated(positionBefore, move, alpha, isFlipped, squareSize, pieceset, sq)));
		return (
			<>
				{pieces}
				{this.renderMoveArrow(move, alpha, isFlipped, squareSize, colorset)}
				{this.renderTurnFlag(kokopu.oppositeColor(positionBefore.turn()), isFlipped, squareSize, pieceset)}
			</>
		);
	}

	/**
	 * Render the board content when the animation has been completed (or if there is no animation).
	 */
	renderBoardContentStill(position, move, isFlipped, squareSize, colorset, pieceset) {

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
		let arm = parseMarkers(this.props.arrowMarkers, (result, token) => {
			if(/^([GRY])([a-h][1-8])([a-h][1-8])$/.test(token)) {
				if (!(RegExp.$2 in result)) {
					result[RegExp.$2] = {};
				}
				result[RegExp.$2][RegExp.$3] = RegExp.$1.toLowerCase();
			}
		});

		// Render the square-related objects.
		let pieces = [];
		let handles = [];
		let squareMarkers = [];
		let textMarkers = [];
		let arrowMarkers = [];
		kokopu.forEachSquare(sq => {
			pieces.push(this.renderPiece(position, isFlipped, squareSize, pieceset, sq));
			if (this.props.interactionMode) {
				handles.push(this.renderSquareHandle(position, isFlipped, squareSize, sq));
			}
			squareMarkers.push(this.renderSquareMarker(sqm, isFlipped, squareSize, colorset, sq));
			textMarkers.push(this.renderTextMarker(txtm, isFlipped, squareSize, colorset, sq));
			arrowMarkers = arrowMarkers.concat(this.renderArrowMarkers(arm, isFlipped, squareSize, colorset, sq));
		});
		return (
			<>
				{squareMarkers}
				{this.renderHoveredSquare(isFlipped, squareSize, colorset)}
				{pieces}
				{textMarkers}
				{arrowMarkers}
				{this.renderMoveArrow(move, 1, isFlipped, squareSize, colorset)}
				{handles}
				{this.renderDraggedPiece(position, isFlipped, squareSize, pieceset)}
				{this.renderDraggedArrow(isFlipped, squareSize, colorset)}
				{this.renderTurnFlag(position.turn(), isFlipped, squareSize, pieceset)}
			</>
		);
	}

	renderSquare(isFlipped, squareSize, colorset, sq) {
		let { x, y } = this.getSquareCoordinates(isFlipped, squareSize, sq);
		return <rect key={sq} x={x} y={y} width={squareSize} height={squareSize} fill={colorset[kokopu.squareColor(sq)]} />;
	}

	renderHoveredSquare(isFlipped, squareSize, colorset) {
		if (this.state.hoveredSquare === '-') {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(isFlipped, squareSize, this.state.hoveredSquare);
		let thickness = Math.max(2, Math.round(HOVER_MARKER_THICKNESS_FACTOR * squareSize));
		let size = squareSize - thickness;
		return <rect className="kokopu-hoveredSquare" x={x + thickness/2} y={y + thickness/2} width={size} height={size} stroke={colorset.highlight} strokeWidth={thickness} />;
	}

	renderPiece(position, isFlipped, squareSize,  pieceset, sq) {
		let cp = position.square(sq);
		if (cp === '-' || (this.isPieceDragModeEnabled() && this.state.draggedSquare === sq)) {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(isFlipped, squareSize, sq);
		return <image key={'piece-' + sq} x={x} y={y} width={squareSize} height={squareSize} href={pieceset[cp]} />;
	}

	renderPieceAnimated(positionBefore, move, alpha, isFlipped, squareSize,  pieceset, sq) {
		let cp = positionBefore.square(sq);
		if (cp === '-' || move.to() === sq || (move.isEnPassant() && move.enPassantSquare() === sq)) {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(isFlipped, squareSize, sq);
		if (sq === move.from()) {
			let { x: xTo, y: yTo } = this.getSquareCoordinates(isFlipped, squareSize, move.to());
			x = xTo * alpha + x * (1 - alpha);
			y = yTo * alpha + y * (1 - alpha);
			if (move.isPromotion() && alpha > 0.8) {
				cp = move.coloredPromotion();
			}
		}
		else if (move.isCastling() && sq === move.rookFrom()) {
			let { x: xTo, y: yTo } = this.getSquareCoordinates(isFlipped, squareSize, move.rookTo());
			x = xTo * alpha + x * (1 - alpha);
			y = yTo * alpha + y * (1 - alpha);
		}
		return <image key={'piece-' + sq} x={x} y={y} width={squareSize} height={squareSize} href={pieceset[cp]} />;
	}

	renderDraggedPiece(position, isFlipped, squareSize, pieceset) {
		if (!this.isPieceDragModeEnabled() || this.state.draggedSquare === '-') {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(isFlipped, squareSize, this.state.draggedSquare);
		let cp = position.square(this.state.draggedSquare);
		return (
			<image
				className="kokopu-pieceDraggable kokopu-dragging"
				x={x + this.state.dragPosition.x} y={y + this.state.dragPosition.y} width={squareSize} height={squareSize} href={pieceset[cp]}
			/>
		);
	}

	renderDraggedArrow(isFlipped, squareSize, colorset) {
		if (!this.isArrowDragModeEnabled() || this.state.draggedSquare === '-') {
			return undefined;
		}
		let strokeWidth = squareSize * STROKE_THICKNESS_FACTOR;
		let arrowTipId = this.getArrowTipId(this.props.editedArrowColor);
		let { x, y } = this.getSquareCoordinates(isFlipped, squareSize, this.state.draggedSquare);
		let xFrom = x + squareSize / 2;
		let yFrom = y + squareSize / 2;
		let xTo = Math.min(Math.max(x + this.state.dragPosition.x + this.state.cursorOffset.x, squareSize/2), 15 * squareSize / 2);
		let yTo = Math.min(Math.max(y + this.state.dragPosition.y + this.state.cursorOffset.y, squareSize/2), 15 * squareSize / 2);
		return (
			<line
				className="kokopu-annotation kokopu-arrowDraggable kokopu-dragging" x1={xFrom} y1={yFrom} x2={xTo} y2={yTo}
				stroke={colorset[this.props.editedArrowColor]} style={{ 'strokeWidth': strokeWidth, 'markerEnd': `url(#${arrowTipId})` }}
			/>
		);
	}

	renderSquareHandle(position, isFlipped, squareSize, sq) {
		let { x, y } = this.getSquareCoordinates(isFlipped, squareSize, sq);
		if ((this.isPieceDragModeEnabled() && position.square(sq) !== '-') || this.isArrowDragModeEnabled()) {
			let dragPosition = this.state.draggedSquare === sq ? this.state.dragPosition : { x: 0, y: 0 };
			let bounds = this.isPieceDragModeEnabled() ? { left: -x, top: -y, right: 7 * squareSize - x, bottom: 7 * squareSize - y } : undefined;
			let classNames = [ 'kokopu-handle', this.isPieceDragModeEnabled() ? 'kokopu-pieceDraggable' : 'kokopu-arrowDraggable' ];
			return (
				<Draggable
					key={'handle-' + sq} position={dragPosition} bounds={bounds}
					onStart={evt => this.handleDragStart(sq, evt)}
					onDrag={(_, dragData) => this.handleDrag(sq, dragData)}
					onStop={(_, dragData) => this.handleDragStop(sq, dragData)}
				>
					<rect className={classNames.join(' ')} x={x} y={y} width={squareSize} height={squareSize} />
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

	renderSquareMarker(sqm, isFlipped, squareSize, colorset, sq) {
		let value = sqm[sq];
		if (!isValidAnnotationColor(value)) {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(isFlipped, squareSize, sq);
		return <rect key={'sqm-' + sq} className="kokopu-annotation" x={x} y={y} width={squareSize} height={squareSize} fill={colorset[value]} />;
	}

	renderTextMarker(txtm, isFlipped, squareSize, colorset, sq) {
		let value = txtm[sq];
		if (!value || !isValidAnnotationColor(value.color) || typeof value.text !== 'string') {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(isFlipped, squareSize, sq);
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

	renderArrowMarkers(arm, isFlipped, squareSize, colorset, from) {
		let result = [];
		if (from in arm) {
			let strokeWidth = squareSize * STROKE_THICKNESS_FACTOR;
			let { x: xFrom, y: yFrom } = this.getSquareCoordinates(isFlipped, squareSize, from);
			xFrom += squareSize / 2;
			yFrom += squareSize / 2;
			kokopu.forEachSquare(to => {
				let value = arm[from][to];
				if (from === to || !isValidAnnotationColor(value)) {
					return;
				}
				let arrowTipId = this.getArrowTipId(value);
				let { x: xTo, y: yTo } = this.getSquareCoordinates(isFlipped, squareSize, to);
				xTo += squareSize / 2;
				yTo += squareSize / 2;
				xTo += Math.sign(xFrom - xTo) * ARROW_TIP_OFFSET_FACTOR * squareSize;
				yTo += Math.sign(yFrom - yTo) * ARROW_TIP_OFFSET_FACTOR * squareSize;
				result.push(
					<line
						key={'arm-' + from + to} className="kokopu-annotation" x1={xFrom} y1={yFrom} x2={xTo} y2={yTo}
						stroke={colorset[value]} style={{ 'strokeWidth': strokeWidth, 'markerEnd': `url(#${arrowTipId})` }}
					/>
				);
			});
		}
		return result;
	}

	renderMoveArrow(move, alpha, isFlipped, squareSize, colorset) {
		if (!move || alpha < 0.1 || !this.isMoveArrowVisible() || move.from() === move.to()) {
			return undefined;
		}
		let { x: xFrom, y: yFrom } = this.getSquareCoordinates(isFlipped, squareSize, move.from());
		xFrom += squareSize / 2;
		yFrom += squareSize / 2;
		let { x: xTo, y: yTo } = this.getSquareCoordinates(isFlipped, squareSize, move.to());
		xTo += squareSize / 2;
		yTo += squareSize / 2;
		xTo += Math.sign(xFrom - xTo) * ARROW_TIP_OFFSET_FACTOR * squareSize;
		yTo += Math.sign(yFrom - yTo) * ARROW_TIP_OFFSET_FACTOR * squareSize;
		let x = xTo * alpha + xFrom * (1 - alpha);
		let y = yTo * alpha + yFrom * (1 - alpha);
		return (
			<line
				className="kokopu-annotation" x1={xFrom} y1={yFrom} x2={x} y2={y} stroke={colorset['highlight']}
				style={{ 'strokeWidth': squareSize * STROKE_THICKNESS_FACTOR, 'markerEnd': `url(#${this.getArrowTipId('highlight')})` }}
			/>
		);
	}

	renderArrowTip(colorset, color) {
		return (
			<marker id={this.getArrowTipId(color)} markerWidth={4} markerHeight={4} refX={2.5} refY={2} orient="auto" style={{ fill: colorset[color] }}>
				<path d="M 4,2 L 0,4 L 1,2 L 0,0 Z" />
			</marker>
		);
	}

	renderTurnFlag(turn, isFlipped, squareSize, pieceset) {
		let x = 8 * squareSize + Math.round(TURN_FLAG_SPACING_FACTOR * squareSize);
		let y = turn === (isFlipped ? 'w' : 'b') ? 0 : 7 * squareSize;
		return <image key={'turn-' + turn} x={x} y={y} width={squareSize} height={squareSize} href={pieceset[turn + 'x']} />;
	}

	renderRankCoordinate(isFlipped, squareSize, fontSize, rank) {
		let x = Math.round(-RANK_COORDINATE_WIDTH_FACTOR * fontSize) / 2;
		let y = (isFlipped ? rank + 0.5 : 7.5 - rank) * squareSize;
		let label = RANK_LABELS[rank];
		return <text key={'rank-' + label} className="kokopu-label" x={x} y={y} style={{ 'fontSize': fontSize }}>{label}</text>;
	}

	renderFileCoordinate(isFlipped, squareSize, fontSize, file) {
		let x = (isFlipped ? 7.5 - file : 0.5 + file) * squareSize;
		let y = 8 * squareSize + Math.round(FILE_COORDINATE_HEIGHT_FACTOR * fontSize) / 2;
		let label = FILE_LABELS[file];
		return <text key={'file-' + label} className="kokopu-label" x={x} y={y} style={{ 'fontSize': fontSize }}>{label}</text>;
	}

	handleDragStart(sq, evt) {
		let squareBoundary = evt.target.getBoundingClientRect();
		this.setState({
			draggedSquare: sq,
			hoveredSquare: sq,
			cursorOffset: { x: evt.clientX - squareBoundary.left, y: evt.clientY - squareBoundary.top },
			dragPosition: { x: 0, y: 0 },
		});
	}

	handleDrag(sq, dragData) {
		let isFlipped = this.isFlipped();
		let squareSize = this.getSquareSize();
		let { x, y } = this.getSquareCoordinates(isFlipped, squareSize, sq);
		let targetSq = this.getSquareAt(isFlipped, squareSize, x + dragData.x + this.state.cursorOffset.x, y + dragData.y + this.state.cursorOffset.y);
		this.setState({
			draggedSquare: sq,
			hoveredSquare: targetSq,
			cursorOffset: this.state.cursorOffset,
			dragPosition: { x: dragData.x, y: dragData.y },
		});
	}

	handleDragStop(sq, dragData) {
		let isFlipped = this.isFlipped();
		let squareSize = this.getSquareSize();
		let { x, y } = this.getSquareCoordinates(isFlipped, squareSize, sq);
		let targetSq = this.getSquareAt(isFlipped, squareSize, x + dragData.x + this.state.cursorOffset.x, y + dragData.y + this.state.cursorOffset.y);
		this.setState({
			draggedSquare: '-',
			hoveredSquare: '-',
		});
		if (sq === targetSq) {
			return;
		}
		if (this.isPieceDragModeEnabled() && this.props.onPieceMoved) {
			this.props.onPieceMoved(sq, targetSq);
		}
		else if (this.isArrowDragModeEnabled() && this.props.onArrowEdited) {
			this.props.onArrowEdited(sq, targetSq);
		}
	}

	handleSquareClicked(sq) {
		if (this.props.onSquareClicked) {
			this.props.onSquareClicked(sq);
		}
	}

	/**
	 * Whether the "move piece" mode is enabled or not.
	 */
	isPieceDragModeEnabled() {
		return this.props.interactionMode === 'movePieces';
	}

	/**
	 * Whether the "edit arrow" mode is enabled or not.
	 */
	isArrowDragModeEnabled() {
		return this.props.interactionMode === 'editArrows' && isValidAnnotationColor(this.props.editedArrowColor);
	}

	/**
	 * Whether the board is flipped (i.e. seen from Black's point of view) or not.
	 */
	isFlipped() {
		return sanitizeBoolean(this.props.isFlipped, false);
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
		return sanitizeBoolean(this.props.coordinateVisible, true);
	}

	/**
	 * Whether an arrow is displayed when moving a piece or not.
	 */
	isMoveArrowVisible() {
		return sanitizeBoolean(this.props.moveArrowVisible, true);
	}

	/**
	 * Whether moves are animated or not.
	 */
	isAnimated() {
		return sanitizeBoolean(this.props.animated, false);
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
	getSquareCoordinates(isFlipped, squareSize, sq) {
		let { file, rank } = kokopu.squareToCoordinates(sq);
		let x = isFlipped ? (7 - file) * squareSize : file * squareSize;
		let y = isFlipped ? rank * squareSize : (7 - rank) * squareSize;
		return { x: x, y: y };
	}

	/**
	 * Return the square at the given location.
	 */
	getSquareAt(isFlipped, squareSize, x, y) {
		let file = isFlipped ? 7 - Math.floor(x / squareSize) : Math.floor(x / squareSize);
		let rank = isFlipped ? Math.floor(y / squareSize) : 7 - Math.floor(y / squareSize);
		return file >= 0 && file < 8 && rank >= 0 && rank < 8 ? kokopu.coordinatesToSquare(file, rank) : '-';
	}

	/**
	 * Return the DOM ID of an arrow tip with the given color.
	 */
	getArrowTipId(color) {
		return 'kokopu-arrowTip-' + color + '-' + this.arrowTipIdSuffix;
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
	 * Displayed move (optional), defined as a {@link kokopu.MoveDescriptor} or as a SAN string. In both cases, it must represent a legal move in position
	 * defined in attribute `position`.
	 */
	move: PropTypes.oneOfType([
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
	 * Arrow markers, defined as a "squareFrom -> squareTo -> color" struct (e.g. `{ e2: { e4: 'G' }, g8: { f6: 'R', h6: 'Y' }}`)
	 * or as a comma-separated CAL string (e.g. `'Ge2e4,Rg8f6,Yg8h6'`).
	 */
	arrowMarkers: PropTypes.oneOfType([
		PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
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
	 * Whether moves are highlighted with an arrow or not.
	 */
	moveArrowVisible: PropTypes.bool,

	/**
	 * Whether moves are animated or not.
	 */
	animated: PropTypes.bool,

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
	interactionMode: PropTypes.oneOf([ '', 'movePieces', 'clickSquares', 'editArrows' ]),

	/**
	 * Color of the edited arrow (only used if `interactionMode` is set to `'editArrows'`).
	 */
	editedArrowColor: PropTypes.oneOf([ '', 'g', 'r', 'y' ]),

	/**
	 * Callback invoked when a piece is moved through drag&drop (only if `interactionMode` is set to `'movePieces'`).
	 */
	onPieceMoved: PropTypes.func,

	/**
	 * Callback invoked when the user clicks on a square (only if `interactionMode` is set to `'clickSquares'`).
	 */
	onSquareClicked: PropTypes.func,

	/**
	 * Callback invoked when an arrow is dragged (only if `interactionMode` is set to `'editArrows'`).
	 */
	onArrowEdited: PropTypes.func,
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
		return { error: false, position: position };
	}
	else if (typeof position === 'string') {
		try {
			return { error: false, position: new kokopu.Position(position) };
		}
		catch (e) {
			if (e instanceof kokopu.exception.InvalidFEN) {
				return { error: true, message: e.message };
			}
			else {
				throw e;
			}
		}
	}
	else if (!position) {
		return { error: false, position: new kokopu.Position() };
	}
	else {
		return { error: true, message: 'Invalid "position" attribute.' };
	}
}


/**
 * Try to interpret the given object `move` as a move descriptor based on the given position.
 *
 * @param {kokopu.Position} position
 * @param {*} move
 * @returns {({error:false, move:kokopu.MoveDescriptor}|{error:true, message:string})}
 */
function parseMove(position, move) {
	if (kokopu.isMoveDescriptor(move)) {
		return { error: false, move: move };
	}
	else if (typeof move === 'string') {
		try {
			return { error: false, move: position.notation(move) };
		}
		catch (e) {
			if (e instanceof kokopu.exception.InvalidNotation) {
				return { error: true, message: e.message };
			}
			else {
				throw e;
			}
		}
	}
	else {
		return { error: true, message: 'Invalid "move" attribute.' };
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


/**
 * Generate a random string.
 *
 * @returns {string}
 */
function generateRandomId() {
	let buffer = new Uint32Array(8);
	crypto.getRandomValues(buffer);
	let result = '';
	for (let i = 0; i < buffer.length; ++i) {
		result += buffer[i].toString(16);
	}
	return result;
}
