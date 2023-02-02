/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2023  Yoann Le Montagner <yo35 -at- melix.net>       *
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


import * as PropTypes from 'prop-types';
import * as React from 'react';
import { exception, MoveDescriptor, Position, coordinatesToSquare, forEachSquare, oppositeColor, squareColor, squareToCoordinates } from 'kokopu';

import { colorsets } from './impl/colorsets';
import { piecesets } from './impl/piecesets';
import { AnnotationSymbolShape } from './impl/AnnotationSymbolShape';
import { ArrowTip } from './impl/ArrowTip';
import DraggableHandle from './impl/DraggableHandle';
import Motion from './impl/Motion';
import ErrorBox from './ErrorBox';
import { i18n } from './i18n';
import { parseSquareMarkers, parseTextMarkers, parseArrowMarkers } from './markers';
import { isAnnotationSymbol, isAnnotationColor } from './types';
import { MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, sanitizeInteger, generateRandomId, isValidSquare, isValidVector } from './impl/util';

import './css/chessboard.css';
import './css/arrow.css';

const TURN_FLAG_SPACING_FACTOR = 0.1;
const RANK_COORDINATE_WIDTH_FACTOR = 1;
const FILE_COORDINATE_HEIGHT_FACTOR = 1.4;
const HOVER_MARKER_THICKNESS_FACTOR = 0.1;
const STROKE_THICKNESS_FACTOR = 0.15;
const ARROW_TIP_OFFSET_FACTOR = 0.3;

const MOTION_DURATION = 150;

const RANK_LABELS = '12345678';
const FILE_LABELS = 'abcdefgh';


/**
 * SVG image representing a chessboard diagram. Optionally, the user may interact with the board (move pieces, click on squares...).
 * Annotations such as square markers or arrows can also be added to the board.
 */
export default class Chessboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			inhibitedSquare: '-',
			draggedSquare: '-',
			hoveredSquare: '-',
			promotionDrawer: false,
			windowWidth: window.innerWidth,
		};
		this.arrowTipIdSuffix = generateRandomId();
	}

	componentDidMount() {
		this.windowResizeListener = () => this.handleWindowResize();
		window.addEventListener('resize', this.windowResizeListener);
	}

	componentWillUnmount() {
		if (this.windowResizeListener) {
			window.removeEventListener('resize', this.windowResizeListener);
			this.windowResizeListener = null;
		}
	}

	render() {

		// Compute the current position.
		let info = this.getPositionAndMoveInfo();
		if (info.positionError) {
			return <ErrorBox title={i18n.INVALID_FEN_ERROR_TITLE} message={info.message} />;
		}
		else if (info.moveError) {
			return <ErrorBox title={i18n.INVALID_NOTATION_ERROR_TITLE} message={info.message} />;
		}
		let { position, move, positionBefore } = info;

		// Compute the attributes.
		let squareSize = this.getSquareSize();
		let coordinateVisible = this.isCoordinateVisible();
		let fontSize = computeCoordinateFontSize(squareSize);
		let colorset = colorsets[this.props.colorset];
		let pieceset = piecesets[this.props.pieceset];
		if (isNaN(squareSize) || !colorset || !pieceset) {
			return undefined;
		}

		// Render the squares.
		let squares = [];
		forEachSquare(sq => squares.push(this.renderSquare(squareSize, colorset, sq)));

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
				<defs>
					{this.renderArrowTip(colorset, 'b')}
					{this.renderArrowTip(colorset, 'g')}
					{this.renderArrowTip(colorset, 'r')}
					{this.renderArrowTip(colorset, 'y')}
				</defs>
				{squares}
				{rankCoordinates}
				{fileCoordinates}
				{this.renderBoardContent(position, positionBefore, move, squareSize, colorset, pieceset)}
			</svg>
		);
	}

	renderBoardContent(position, positionBefore, move, squareSize, colorset, pieceset) {
		if (move && this.props.animated) {
			let key = positionBefore.variant() + '|' + positionBefore.fen() + '|' + move.toString();
			return (
				<Motion key={key} duration={MOTION_DURATION}>
					{motionCursor => (motionCursor === 1 ? this.renderBoardContentStill(position, move, squareSize, colorset, pieceset)
						: this.renderBoardContentAnimated(positionBefore, move, motionCursor, squareSize, colorset, pieceset))}
				</Motion>
			);
		}
		else {
			return this.renderBoardContentStill(position, move, squareSize, colorset, pieceset);
		}
	}

	/**
	 * Render the board content during the animation.
	 */
	renderBoardContentAnimated(positionBefore, move, motionCursor, squareSize, colorset, pieceset) {
		let pieces = [];
		forEachSquare(sq => pieces.push(this.renderPieceAnimated(positionBefore, move, motionCursor, squareSize, pieceset, sq)));
		return (
			<>
				{pieces}
				{this.renderMoveArrow(move, motionCursor, squareSize, colorset)}
				{this.renderTurnFlag(oppositeColor(positionBefore.turn()), squareSize, pieceset)}
			</>
		);
	}

	/**
	 * Render the board content when the animation has been completed (or if there is no animation).
	 */
	renderBoardContentStill(position, move, squareSize, colorset, pieceset) {

		// Compute the annotations.
		let sqm = parseMarkers(this.props.squareMarkers, parseSquareMarkers, isValidSquare, isAnnotationColor);
		let txtm = parseMarkers(this.props.textMarkers, parseTextMarkers, isValidSquare, value => value && isAnnotationSymbol(value.symbol) && isAnnotationColor(value.color));
		let arm = parseMarkers(this.props.arrowMarkers, parseArrowMarkers, isValidVector, isAnnotationColor);

		// Render the square-related objects.
		let pieces = [];
		let handles = [];
		forEachSquare(sq => {
			pieces.push(this.renderPiece(position, squareSize, pieceset, sq));
			if (this.props.interactionMode) {
				handles.push(this.renderSquareHandle(position,  squareSize, sq));
			}
		});
		return (
			<>
				{this.renderSquareMarkers(sqm, squareSize, colorset)}
				{this.renderHoveredSquare(squareSize, colorset)}
				{pieces}
				{this.renderTextMarkers(txtm, squareSize, colorset)}
				{this.renderArrowMarkers(arm, squareSize, colorset)}
				{this.renderMoveArrow(move, 1, squareSize, colorset)}
				{handles}
				{this.renderPromotionDrawer(position, squareSize, colorset, pieceset)}
				{this.renderDraggedPiece(position, squareSize, pieceset)}
				{this.renderDraggedArrow(squareSize, colorset)}
				{this.renderTurnFlag(position.turn(), squareSize, pieceset)}
			</>
		);
	}

	renderSquare(squareSize, colorset, sq) {
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		return <rect key={sq} x={x} y={y} width={squareSize} height={squareSize} fill={colorset[squareColor(sq)]} />;
	}

	renderHoveredSquare(squareSize, colorset) {
		if (this.state.hoveredSquare === '-') {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(squareSize, this.state.hoveredSquare);
		let thickness = Math.max(2, Math.round(HOVER_MARKER_THICKNESS_FACTOR * squareSize));
		let size = squareSize - thickness;
		let color = this.isEditArrowModeEnabled() ? this.props.editedArrowColor : this.props.moveArrowColor;
		return <rect className="kokopu-hoveredSquare" x={x + thickness/2} y={y + thickness/2} width={size} height={size} stroke={colorset['c' + color]} strokeWidth={thickness} />;
	}

	renderPiece(position, squareSize,  pieceset, sq) {
		let cp = position.square(sq);
		if (cp === '-' || this.state.inhibitedSquare === sq) {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		return <image key={'piece-' + sq} x={x} y={y} width={squareSize} height={squareSize} href={pieceset[cp]} />;
	}

	renderPieceAnimated(positionBefore, move, motionCursor, squareSize,  pieceset, sq) {
		let cp = positionBefore.square(sq);
		if (cp === '-' || move.to() === sq || (move.isEnPassant() && move.enPassantSquare() === sq)) {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		if (sq === move.from()) {
			let { x: xTo, y: yTo } = this.getSquareCoordinates(squareSize, move.to());
			x = xTo * motionCursor + x * (1 - motionCursor);
			y = yTo * motionCursor + y * (1 - motionCursor);
			if (move.isPromotion() && motionCursor > 0.8) {
				cp = move.coloredPromotion();
			}
		}
		else if (move.isCastling() && sq === move.rookFrom()) {
			let { x: xTo, y: yTo } = this.getSquareCoordinates(squareSize, move.rookTo());
			x = xTo * motionCursor + x * (1 - motionCursor);
			y = yTo * motionCursor + y * (1 - motionCursor);
		}
		return <image key={'piece-' + sq} x={x} y={y} width={squareSize} height={squareSize} href={pieceset[cp]} />;
	}

	renderDraggedPiece(position, squareSize, pieceset) {
		if (!(this.isMovePieceModeEnabled() || this.isPlayMoveModeEnabled()) || this.state.draggedSquare === '-') {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(squareSize, this.state.draggedSquare);
		x = Math.min(Math.max(x + this.state.dragPosition.x, 0), 7 * squareSize);
		y = Math.min(Math.max(y + this.state.dragPosition.y, 0), 7 * squareSize);
		let cp = position.square(this.state.draggedSquare);
		return <image className="kokopu-pieceDraggable kokopu-dragging" x={x} y={y} width={squareSize} height={squareSize} href={pieceset[cp]} />;
	}

	renderDraggedArrow(squareSize, colorset) {
		if (!this.isEditArrowModeEnabled() || this.state.draggedSquare === '-') {
			return undefined;
		}
		let strokeWidth = squareSize * STROKE_THICKNESS_FACTOR;
		let arrowTipId = this.getArrowTipId(this.props.editedArrowColor);
		let { x, y } = this.getSquareCoordinates(squareSize, this.state.draggedSquare);
		let xFrom = x + squareSize / 2;
		let yFrom = y + squareSize / 2;
		let xTo = Math.min(Math.max(x + this.state.dragPosition.x + this.state.cursorOffset.x, squareSize/2), 15 * squareSize / 2);
		let yTo = Math.min(Math.max(y + this.state.dragPosition.y + this.state.cursorOffset.y, squareSize/2), 15 * squareSize / 2);
		return (
			<line
				className="kokopu-annotation kokopu-arrow kokopu-arrowDraggable kokopu-dragging" x1={xFrom} y1={yFrom} x2={xTo} y2={yTo}
				stroke={colorset['c' + this.props.editedArrowColor]} strokeWidth={strokeWidth} markerEnd={`url(#${arrowTipId})`}
			/>
		);
	}

	renderPromotionDrawer(position, squareSize, colorset, pieceset) {
		if (!this.state.promotionDrawer) {
			return undefined;
		}
		let { x, y } = this.getSquareCoordinates(squareSize, this.state.promotionDrawer.origin);
		let inverted = position.turn() === (this.props.flipped ? 'w' : 'b'); // false==top-to-bottom true==bottom-to-top
		let y0 = inverted ? y - squareSize * (this.state.promotionDrawer.buttons.length - 1) : y;
		let buttons = this.state.promotionDrawer.buttons.map((p, i) => {
			let cp = position.turn() + p;
			return <image key={'drawer-piece-' + p} className="kokopu-clickable" x={x} y={y + i * (inverted ? -squareSize : squareSize)}
				width={squareSize} height={squareSize} href={pieceset[cp]} onClick={() => this.handleDrawerButtonClicked(p)} />;
		});
		return (
			<>
				<rect className="kokopu-handle" x={0} y={0} width={squareSize * 8} height={squareSize * 8} onClick={() => this.handleDrawerCancelButtonClicked()} />
				<rect x={x} y={y0} width={squareSize} height={squareSize * this.state.promotionDrawer.buttons.length} fill={colorset.b} />
				<rect x={x} y={y0} width={squareSize} height={squareSize * this.state.promotionDrawer.buttons.length} className="kokopu-drawerMask" fill={colorset.w} />
				{buttons}
			</>
		);
	}

	renderSquareHandle(position, squareSize, sq) {
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		let dragEnabledForMovePieces = this.isMovePieceModeEnabled() && position.square(sq) !== '-';
		let dragEnabledForEditArrows = this.isEditArrowModeEnabled();
		let dragEnabledForPlayMoves = this.isPlayMoveModeEnabled() && position.isLegal() && position.square(sq).startsWith(position.turn()) && !this.state.promotionDrawer;
		if (dragEnabledForMovePieces || dragEnabledForEditArrows || dragEnabledForPlayMoves) {
			return (
				<DraggableHandle key={'handle-' + sq} x={x} y={y} width={squareSize} height={squareSize} isArrowHandle={this.isEditArrowModeEnabled()}
					onDragStart={(x0, y0) => this.handleDragStart(sq, x0, y0)}
					onDrag={(dx, dy) => this.handleDrag(sq, dx, dy)}
					onDragStop={(dx, dy) => this.handleDragStop(sq, dx, dy)}
					onDragCanceled={() => this.handleDragCanceled()}
				/>
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

	renderSquareMarkers(sqm, squareSize, colorset) {
		let result = [];
		Object.entries(sqm).forEach(([ sq, color ]) => {
			let { x, y } = this.getSquareCoordinates(squareSize, sq);
			result.push(<rect key={'sqm-' + sq} className="kokopu-annotation" x={x} y={y} width={squareSize} height={squareSize} fill={colorset['c' + color]} />);
		});
		return result;
	}

	renderTextMarkers(txtm, squareSize, colorset) {
		let result = [];
		Object.entries(txtm).forEach(([ sq, value ]) => {
			let { x, y } = this.getSquareCoordinates(squareSize, sq);
			x += squareSize / 2;
			y += squareSize / 2;
			result.push(
				<g key={'txtm-' + sq} className="kokopu-annotation">
					<AnnotationSymbolShape x={x} y={y} size={squareSize} symbol={value.symbol} color={colorset['c' + value.color]} />
				</g>
			);
		});
		return result;
	}

	renderArrowMarkers(arm, squareSize, colorset) {
		let result = [];
		let strokeWidth = squareSize * STROKE_THICKNESS_FACTOR;
		Object.entries(arm).forEach(([ vect, color ]) => {
			let from = vect.substring(0, 2);
			let to = vect.substring(2, 4);
			if (from === to) {
				return;
			}
			let { x: xFrom, y: yFrom } = this.getSquareCoordinates(squareSize, from);
			let { x: xTo, y: yTo } = this.getSquareCoordinates(squareSize, to);
			xFrom += squareSize / 2;
			yFrom += squareSize / 2;
			xTo += squareSize / 2;
			yTo += squareSize / 2;
			xTo += Math.sign(xFrom - xTo) * ARROW_TIP_OFFSET_FACTOR * squareSize;
			yTo += Math.sign(yFrom - yTo) * ARROW_TIP_OFFSET_FACTOR * squareSize;
			let arrowTipId = this.getArrowTipId(color);
			result.push(
				<line
					key={'arm-' + vect} className="kokopu-annotation kokopu-arrow" x1={xFrom} y1={yFrom} x2={xTo} y2={yTo}
					stroke={colorset['c' + color]} strokeWidth={strokeWidth} markerEnd={`url(#${arrowTipId})`}
				/>
			);
		});
		return result;
	}

	renderMoveArrow(move, motionCursor, squareSize, colorset) {
		if (!move || motionCursor < 0.1 || !this.props.moveArrowVisible || move.from() === move.to()) {
			return undefined;
		}
		let { x: xFrom, y: yFrom } = this.getSquareCoordinates(squareSize, move.from());
		xFrom += squareSize / 2;
		yFrom += squareSize / 2;
		let { x: xTo, y: yTo } = this.getSquareCoordinates(squareSize, move.to());
		xTo += squareSize / 2;
		yTo += squareSize / 2;
		xTo += Math.sign(xFrom - xTo) * ARROW_TIP_OFFSET_FACTOR * squareSize;
		yTo += Math.sign(yFrom - yTo) * ARROW_TIP_OFFSET_FACTOR * squareSize;
		let x = xTo * motionCursor + xFrom * (1 - motionCursor);
		let y = yTo * motionCursor + yFrom * (1 - motionCursor);
		let color = this.props.moveArrowColor;
		return (
			<line
				className="kokopu-annotation kokopu-arrow" x1={xFrom} y1={yFrom} x2={x} y2={y} stroke={colorset['c' + color]}
				strokeWidth={squareSize * STROKE_THICKNESS_FACTOR} markerEnd={`url(#${this.getArrowTipId(color)})`}
			/>
		);
	}

	renderArrowTip(colorset, color) {
		return <ArrowTip id={this.getArrowTipId(color)} color={colorset['c' + color]} />;
	}

	renderTurnFlag(turn, squareSize, pieceset) {
		let x = 8 * squareSize + Math.round(TURN_FLAG_SPACING_FACTOR * squareSize);
		let y = turn === (this.props.flipped ? 'b' : 'w') ? 7 * squareSize : 0;
		return <image key={'turn-' + turn} x={x} y={y} width={squareSize} height={squareSize} href={pieceset[turn + 'x']} />;
	}

	renderRankCoordinate(squareSize, fontSize, rank) {
		let x = Math.round(-RANK_COORDINATE_WIDTH_FACTOR * fontSize) / 2;
		let y = (this.props.flipped ? rank + 0.5 : 7.5 - rank) * squareSize;
		let label = RANK_LABELS[rank];
		return <text key={'rank-' + label} className="kokopu-coordinate" x={x} y={y} fontSize={fontSize}>{label}</text>;
	}

	renderFileCoordinate(squareSize, fontSize, file) {
		let x = (this.props.flipped ? 7.5 - file : 0.5 + file) * squareSize;
		let y = 8 * squareSize + Math.round(FILE_COORDINATE_HEIGHT_FACTOR * fontSize) / 2;
		let label = FILE_LABELS[file];
		return <text key={'file-' + label} className="kokopu-coordinate" x={x} y={y} fontSize={fontSize}>{label}</text>;
	}

	handleWindowResize() {
		this.setState({ windowWidth: window.innerWidth });
	}

	handleDragStart(sq, x0, y0) {
		this.setState({
			inhibitedSquare: this.isMovePieceModeEnabled() || this.isPlayMoveModeEnabled() ? sq : '-',
			draggedSquare: sq,
			hoveredSquare: sq,
			cursorOffset: { x: x0, y: y0 },
			dragPosition: { x: 0, y: 0 },
		});
	}

	handleDrag(sq, dx, dy) {
		let squareSize = this.getSquareSize();
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		let targetSq = this.getSquareAt(squareSize, x + dx + this.state.cursorOffset.x, y + dy + this.state.cursorOffset.y);
		this.setState({
			hoveredSquare: targetSq,
			dragPosition: { x: dx, y: dy },
		});
	}

	handleDragStop(sq, dx, dy) {
		let squareSize = this.getSquareSize();
		let { x, y } = this.getSquareCoordinates(squareSize, sq);
		let targetSq = this.getSquareAt(squareSize, x + dx + this.state.cursorOffset.x, y + dy + this.state.cursorOffset.y);
		this.setState({
			inhibitedSquare: '-',
			draggedSquare: '-',
			hoveredSquare: '-',
		});
		if (sq === targetSq || targetSq === '-') {
			return;
		}
		if (this.isMovePieceModeEnabled() && this.props.onPieceMoved) {
			this.props.onPieceMoved(sq, targetSq);
		}
		else if (this.isEditArrowModeEnabled() && this.props.onArrowEdited) {
			this.props.onArrowEdited(sq, targetSq);
		}
		else if (this.isPlayMoveModeEnabled()) {
			let { position } = this.getPositionAndMoveInfo();
			let info = position.isMoveLegal(sq, targetSq);
			if (!info) {
				return;
			}
			switch (info.status) {

				// Regular move.
				case 'regular':
					if (this.props.onMovePlayed) {
						this.props.onMovePlayed(position.notation(info()));
					}
					break;

				// Promotion move.
				case 'promotion':
					this.setState({
						inhibitedSquare: sq,
						promotionDrawer: {
							origin: targetSq,
							buttons: position.variant() === 'antichess' ? [ 'q', 'r', 'b', 'n', 'k' ] : [ 'q', 'r', 'b', 'n' ],
							builder: piece => position.notation(info(piece)),
						},
					});
					break;

				// Other cases are not supposed to happen.
				// istanbul ignore next
				default:
					break;
			}
		}
	}

	handleDragCanceled() {
		this.setState({
			inhibitedSquare: '-',
			draggedSquare: '-',
			hoveredSquare: '-',
		});
	}

	handleDrawerCancelButtonClicked() {
		this.setState({
			inhibitedSquare: '-',
			promotionDrawer: false,
		});
	}

	handleDrawerButtonClicked(piece) {
		let builder = this.state.promotionDrawer.builder;
		this.setState({
			inhibitedSquare: '-',
			promotionDrawer: false,
		});
		if (this.props.onMovePlayed) {
			this.props.onMovePlayed(builder(piece));
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
	isMovePieceModeEnabled() {
		return this.props.interactionMode === 'movePieces';
	}

	/**
	 * Whether the "play move" mode is enabled or not.
	 */
	isPlayMoveModeEnabled() {
		return this.props.interactionMode === 'playMoves';
	}

	/**
	 * Whether the "edit arrow" mode is enabled or not.
	 */
	isEditArrowModeEnabled() {
		return this.props.interactionMode === 'editArrows' && isAnnotationColor(this.props.editedArrowColor);
	}

	/**
	 * Return the (sanitized) square size.
	 */
	getSquareSize() {
		let squareSize = sanitizeInteger(this.props.squareSize, MIN_SQUARE_SIZE, MAX_SQUARE_SIZE);
		let limit = computeSmallScreenLimits('squareSize', this.props.smallScreenLimits, this.state.windowWidth);
		return isNaN(limit) ? squareSize : sanitizeInteger(limit, MIN_SQUARE_SIZE, squareSize);
	}

	/**
	 * Whether the file/rank coordinates are visible or not.
	 */
	isCoordinateVisible() {
		let limit = computeSmallScreenLimits('coordinateVisible', this.props.smallScreenLimits, this.state.windowWidth);
		return this.props.coordinateVisible && (limit === undefined || limit);
	}

	/**
	 * Return the (x,y) coordinates of the given square in the SVG canvas.
	 */
	getSquareCoordinates(squareSize, sq) {
		let { file, rank } = squareToCoordinates(sq);
		let x = this.props.flipped ? (7 - file) * squareSize : file * squareSize;
		let y = this.props.flipped ? rank * squareSize : (7 - rank) * squareSize;
		return { x: x, y: y };
	}

	/**
	 * Return information regarding the currently displayed position and move, or parsing error message if something went wrong.
	 */
	getPositionAndMoveInfo() {

		// Parse the position.
		let positionInfo = parsePosition(this.props.position);
		if (positionInfo.error) {
			return { positionError: true, moveError: true, message: positionInfo.message };
		}

		// Nothing else to do if no move is defined.
		if (!this.props.move) {
			return { positionError: false, moveError: false, position: positionInfo.position };
		}

		// Parse the move.
		let moveInfo = parseMove(positionInfo.position, this.props.move);
		if (moveInfo.error) {
			return { positionError: false, moveError: true, message: moveInfo.message, positionBefore: positionInfo.position };
		}

		// Compute the position after the move and return the result.
		let positionAfter = new Position(positionInfo.position);
		positionAfter.play(moveInfo.move);
		return { positionError: false, moveError: false, positionBefore: positionInfo.position, move: moveInfo.move, position: positionAfter };
	}

	/**
	 * Return the square at the given location.
	 */
	getSquareAt(squareSize, x, y) {
		let file = this.props.flipped ? 7 - Math.floor(x / squareSize) : Math.floor(x / squareSize);
		let rank = this.props.flipped ? Math.floor(y / squareSize) : 7 - Math.floor(y / squareSize);
		return file >= 0 && file < 8 && rank >= 0 && rank < 8 ? coordinatesToSquare(file, rank) : '-';
	}

	/**
	 * Return the DOM ID of an arrow tip with the given color.
	 */
	getArrowTipId(color) {
		return 'kokopu-arrowTip-' + color + '-' + this.arrowTipIdSuffix;
	}

	/**
	 * Return the size of the chessboard, assuming it is built with the given attributes.
	 *
	 * @param {number} squareSize
	 * @param {boolean} coordinateVisible
	 * @param {{width:number, squareSize:number, coordinateVisible:boolean}[]} smallScreenLimits
	 * @returns {{width:number, height:number}}
	 * @public
	 */
	static size(squareSize, coordinateVisible, smallScreenLimits) {

		// Enforce small-screen limits, if any.
		if (typeof window !== 'undefined') {
			let squareSizeLimit = computeSmallScreenLimits('squareSize', smallScreenLimits, window.innerWidth);
			let coordinateVisibleLimit = computeSmallScreenLimits('coordinateVisible', smallScreenLimits, window.innerWidth);
			if (!isNaN(squareSizeLimit)) {
				squareSize = sanitizeInteger(squareSizeLimit, MIN_SQUARE_SIZE, squareSize);
			}
			coordinateVisible = coordinateVisible && (coordinateVisibleLimit === undefined || coordinateVisibleLimit);
		}

		// Compute the dimensions.
		let width = 9 * squareSize + Math.round(TURN_FLAG_SPACING_FACTOR * squareSize);
		let height = 8 * squareSize;
		if (coordinateVisible) {
			let fontSize = computeCoordinateFontSize(squareSize);
			width += Math.round(RANK_COORDINATE_WIDTH_FACTOR * fontSize);
			height += Math.round(FILE_COORDINATE_HEIGHT_FACTOR * fontSize);
		}
		return { width: width, height: height };
	}

	/**
	 * Return the maximum square size that would allow the chessboard to fit in a rectangle of size `width x height`.
	 *
	 * @param {number} width
	 * @param {number} height
	 * @param {boolean} coordinateVisible
	 * @param {{width:number, squareSize:number, coordinateVisible:boolean}[]} smallScreenLimits
	 * @returns {number}
	 * @public
	 */
	static adaptSquareSize(width, height, coordinateVisible, smallScreenLimits) {
		let maxSquareSize = MAX_SQUARE_SIZE;

		// Enforce small-screen limits, if any.
		if (typeof window !== 'undefined') {
			let squareSizeLimit = computeSmallScreenLimits('squareSize', smallScreenLimits, window.innerWidth);
			let coordinateVisibleLimit = computeSmallScreenLimits('coordinateVisible', smallScreenLimits, window.innerWidth);
			if (!isNaN(squareSizeLimit)) {
				maxSquareSize = sanitizeInteger(squareSizeLimit, MIN_SQUARE_SIZE, maxSquareSize);
			}
			coordinateVisible = coordinateVisible && (coordinateVisibleLimit === undefined || coordinateVisibleLimit);
		}

		function isAdapted(squareSize) {
			let actualWidth = 9 * squareSize + Math.round(TURN_FLAG_SPACING_FACTOR * squareSize);
			let actualHeight = 8 * squareSize;
			if (coordinateVisible) {
				let fontSize = computeCoordinateFontSize(squareSize);
				actualWidth += Math.round(RANK_COORDINATE_WIDTH_FACTOR * fontSize);
				actualHeight += Math.round(FILE_COORDINATE_HEIGHT_FACTOR * fontSize);
			}
			return actualWidth <= width && actualHeight <= height;
		}

		// Check min/max bounds.
		if (isAdapted(maxSquareSize)) {
			return maxSquareSize;
		}
		else if (!isAdapted(MIN_SQUARE_SIZE)) {
			return MIN_SQUARE_SIZE;
		}

		// Dichotomic search, between a (inclusive) and b (exclusive).
		let a = MIN_SQUARE_SIZE;
		let b = maxSquareSize;
		while (a + 1 < b) {
			let mid = Math.floor((a + b) / 2);
			if (isAdapted(mid)) {
				a = mid;
			}
			else {
				b = mid;
			}
		}
		return a;
	}

	/**
	 * Minimum square size (inclusive).
	 *
	 * @returns {number}
	 * @public
	 */
	static minSquareSize() {
		return MIN_SQUARE_SIZE;
	}

	/**
	 * Maximum square size (inclusive).
	 *
	 * @returns {number}
	 * @public
	 */
	static maxSquareSize() {
		return MAX_SQUARE_SIZE;
	}

	/**
	 * Available colorsets for theming.
	 *
	 * @returns {Object.<string, { w: string, b: string, cb: string, cg: string, cr: string, cy: string }>}
	 * @public
	 */
	static colorsets() {
		return colorsets;
	}

	/**
	 * Available piecesets for theming.
	 *
	 * @returns {Object.<string, { bb: string, bk: string, bn: string, bp: string, bq: string, br: string, bx: string,
	 *                             wb: string, wk: string, wn: string, wp: string, wq: string, wr: string, wx: string }>}
	 * @public
	 */
	static piecesets() {
		return piecesets;
	}
}


Chessboard.propTypes = {

	/**
	 * Displayed position. Can be a [kokopu.Position](https://kokopu.yo35.org/docs/current/classes/Position.html) object,
	 * a [FEN string](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation),
	 * `'start'` (usual starting position), or `'empty'` (empty board).
	 *
	 * Optionally, the FEN string can be prefixed with `'variant:'`, `variant` corresponding to one of the
	 * [game variant](https://kokopu.yo35.org/docs/current/types/GameVariant.html) supported by Kokopu. For instance:
	 * `'chess960:nrkbqrbn/pppppppp/8/8/8/8/PPPPPPPP/NRKBQRBN w KQkq - 0 1'`.
	 */
	position: PropTypes.oneOfType([
		PropTypes.instanceOf(Position),
		PropTypes.string
	]),

	/**
	 * Displayed move (optional), defined either as a [kokopu.MoveDescriptor](https://kokopu.yo35.org/docs/current/classes/MoveDescriptor.html) object
	 * or as a [SAN string](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)) (e.g. `'Nf3'`). In both cases, it must represent
	 * a legal move in position defined in attribute `position`.
	 */
	move: PropTypes.oneOfType([
		PropTypes.instanceOf(MoveDescriptor),
		PropTypes.string
	]),

	/**
	 * Square markers, defined as a "square -> color" struct (e.g. `{ e4: 'g', d5: 'r' }`) or as a comma-separated CSL string (e.g. `'Rd5,Ge4'`).
	 */
	squareMarkers: PropTypes.oneOfType([
		PropTypes.objectOf(PropTypes.oneOf([ 'b', 'g', 'r', 'y' ])),
		PropTypes.string
	]),

	/**
	 * Text markers, defined as a "square -> (symbol, color)" struct (e.g. `{ e4: { symbol: 'A', color: 'g' }, d5: { symbol: 'z', color: 'r' }}`)
	 * or as a comma-separated CTL string (e.g. `'Rzd5,GAe4'`).
	 */
	textMarkers: PropTypes.oneOfType([
		PropTypes.objectOf(PropTypes.shape({
			symbol: PropTypes.string.isRequired,
			color: PropTypes.oneOf([ 'b', 'g', 'r', 'y' ]).isRequired
		})),
		PropTypes.string
	]),

	/**
	 * Arrow markers, defined as a "squareFromSquareTo -> color" struct (e.g. `{ e2e4: 'g', g8f6: 'r', g8h6: 'y' }`)
	 * or as a comma-separated CAL string (e.g. `'Ge2e4,Rg8f6,Yg8h6'`).
	 */
	arrowMarkers: PropTypes.oneOfType([
		PropTypes.objectOf(PropTypes.oneOf([ 'b', 'g', 'r', 'y' ])),
		PropTypes.string
	]),

	/**
	 * Whether the board is flipped (i.e. seen from Black's point of view) or not.
	 */
	flipped: PropTypes.bool,

	/**
	 * Size of the squares (in pixels). Must be an integer between `Chessboard.minSquareSize()` and `Chessboard.maxSquareSize()`.
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
	 * Color of the move arrow.
	 */
	moveArrowColor: PropTypes.oneOf([ 'b', 'g', 'r', 'y' ]),

	/**
	 * Whether moves are animated or not.
	 */
	animated: PropTypes.bool,

	/**
	 * Color theme ID.
	 */
	colorset: PropTypes.oneOf(Object.keys(colorsets)),

	/**
	 * Piece theme ID.
	 */
	pieceset: PropTypes.oneOf(Object.keys(piecesets)),

	/**
	 * Limits applicable on small-screen devices. For instance, if set to
	 * ```
	 * [
	 *   { width: 768, squareSize: 40 },
	 *   { width: 375, squareSize: 24, coordinateVisible: false }
	 * ]
	 * ```
	 * then on screens with resolution ≤768 pixels, the square size will be limited to 40 (whatever the value
	 * of the `squareSize` attribute); in addition, on screens with resolution ≤375 pixels, the square size
	 * will be limited to 24 and the row and column coordinates will always be hidden (whatever the value of the
	 * `coordinateVisible` attribute).
	 */
	smallScreenLimits: PropTypes.arrayOf(PropTypes.shape({
		width: PropTypes.number.isRequired,
		squareSize: PropTypes.number,
		coordinateVisible: PropTypes.bool,
	})),

	/**
	 * Type of action allowed with the mouse on the chessboard. If undefined, then the user cannot interact with the component.
	 *
	 * - `'movePieces'` allows the user to drag & drop the chess pieces from one square to another (regardless of the chess rules),
	 * - `'clickSquares'` allows the user to click on squares,
	 * - `'editArrows'` allows the user to draw arrow markers from one square to another (warning: attribute `editedArrowColor` must be set),
	 * - `'playMoves'` allows the user to play legal chess moves (thus no interaction is possible if the displayed position is not legal).
	 */
	interactionMode: PropTypes.oneOf([ 'movePieces', 'clickSquares', 'editArrows', 'playMoves' ]),

	/**
	 * Color of the edited arrow (only used if `interactionMode` is set to `'editArrows'`).
	 */
	editedArrowColor: PropTypes.oneOf([ 'b', 'g', 'r', 'y' ]),

	/**
	 * Callback invoked when a piece is moved through drag&drop (only if `interactionMode` is set to `'movePieces'`).
	 *
	 * @param {string} from Origin square (e.g. `'g1'`).
	 * @param {string} to Target square (e.g. `'f3'`).
	 */
	onPieceMoved: PropTypes.func,

	/**
	 * Callback invoked when the user clicks on a square (only if `interactionMode` is set to `'clickSquares'`).
	 *
	 * @param {string} square Clicked square (e.g. `e4`).
	 */
	onSquareClicked: PropTypes.func,

	/**
	 * Callback invoked when an arrow is dragged (only if `interactionMode` is set to `'editArrows'`).
	 *
	 * @param {string} from Origin square (e.g. `'g1'`).
	 * @param {string} to Target square (e.g. `'f3'`).
	 */
	onArrowEdited: PropTypes.func,

	/**
	 * Callback invoked when a move is played (only if `interactionMode` is set to `'playMoves'`).
	 *
	 * @param {string} move SAN notation representing the played move (e.g. `Nxe5`).
	 */
	onMovePlayed: PropTypes.func,
};


Chessboard.defaultProps = {
	position: 'start',
	flipped: false,
	squareSize: 40,
	coordinateVisible: true,
	moveArrowVisible: true,
	moveArrowColor: 'b',
	animated: false,
	colorset: 'original',
	pieceset: 'cburnett',
};


/**
 * Compute the limit applicable to the given window width.
 */
function computeSmallScreenLimits(key, smallScreenLimits, windowWidth) {
	if (!(smallScreenLimits instanceof Array)) {
		return undefined;
	}
	let applicableLimits = smallScreenLimits
		.filter(limit => limit && key in limit && windowWidth <= limit.width)
		.sort((la, lb) => la.width - lb.width);
	return applicableLimits.length > 0 ? applicableLimits[0][key] : undefined;
}


/**
 * Return the font size to use for coordinates assuming the given square size.
 */
function computeCoordinateFontSize(squareSize) {
	return squareSize <= 32 ? 8 : 8 + (squareSize - 32) * 0.2;
}


/**
 * Try to interpret the given object as a chess position.
 */
function parsePosition(position) {
	if (position instanceof Position) {
		return { error: false, position: position };
	}
	else if (typeof position === 'string') {
		try {
			return { error: false, position: new Position(position) };
		}
		catch (e) {
			// istanbul ignore else
			if (e instanceof exception.InvalidFEN) {
				return { error: true, message: e.message };
			}
			else {
				throw e;
			}
		}
	}
	else {
		return { error: true, message: i18n.INVALID_POSITION_ATTRIBUTE_ERROR_MESSAGE };
	}
}


/**
 * Try to interpret the given object `move` as a move descriptor based on the given position.
 */
function parseMove(position, move) {
	if (move instanceof MoveDescriptor) {
		return { error: false, move: move };
	}
	else if (typeof move === 'string') {
		try {
			return { error: false, move: position.notation(move) };
		}
		catch (e) {
			// istanbul ignore else
			if (e instanceof exception.InvalidNotation) {
				return { error: true, message: e.message };
			}
			else {
				throw e;
			}
		}
	}
	else {
		return { error: true, message: i18n.INVALID_MOVE_ATTRIBUTE_ERROR_MESSAGE };
	}
}


/**
 * Try to interpret the given object as a list of markers.
 */
function parseMarkers(markers, parse, isValidKey, isValidValue) {
	if (typeof markers === 'string') {
		return parse(markers);
	}
	else if (typeof markers === 'object') {
		let result = {};
		Object.entries(markers)
			.filter(([ key, value ]) => isValidKey(key) && isValidValue(value))
			.forEach(([ key, value ]) => { result[key] = value; });
		return result;
	}
	else {
		return {};
	}
}
