/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2025  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    Kokopu-React is free software: you can redistribute it and/or           *
 *    modify it under the terms of the GNU Lesser General Public License      *
 *    as published by the Free Software Foundation, either version 3 of       *
 *    the License, or (at your option) any later version.                     *
 *                                                                            *
 *    Kokopu-React is distributed in the hope that it will be useful,         *
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of          *
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the            *
 *    GNU Lesser General Public License for more details.                     *
 *                                                                            *
 *    You should have received a copy of the GNU Lesser General               *
 *    Public License along with this program. If not, see                     *
 *    <http://www.gnu.org/licenses/>.                                         *
 *                                                                            *
 * -------------------------------------------------------------------------- */


import * as React from 'react';

import { Color, Piece, ColoredPiece, Square, MoveDescriptor, Position, coordinatesToSquare, forEachSquare, oppositeColor, squareColor, squareToCoordinates } from 'kokopu';

import { generateRandomId } from '../util';
import { Colorset, Pieceset, AnnotationColor, SquareMarkerSet, TextMarkerSet, ArrowMarkerSet } from '../types';

import { AnnotationSymbolShape } from '../icons/AnnotationSymbolShape';
import { ArrowTip } from '../icons/ArrowTip';
import { Draggable } from './Draggable';
import { Motion } from './Motion';

import '../icons/arrow.css';
import './Chessboard.css';

const TURN_FLAG_SPACING_FACTOR = 0.1;
const RANK_COORDINATE_WIDTH_FACTOR = 1;
const FILE_COORDINATE_HEIGHT_FACTOR = 1.4;
const HOVER_MARKER_THICKNESS_FACTOR = 0.1;
const STROKE_THICKNESS_FACTOR = 0.15;
const ARROW_TIP_OFFSET_FACTOR = 0.3;

const MOTION_DURATION = 150;

const RANK_LABELS = '12345678';
const FILE_LABELS = 'abcdefgh';


interface ChessboardImplProps {

    position: Position,
    move?: MoveDescriptor,

    squareMarkers?: SquareMarkerSet,
    textMarkers?: TextMarkerSet,
    arrowMarkers?: ArrowMarkerSet,

    flipped: boolean,
    squareSize: number,
    coordinateVisible: boolean,
    turnVisible: boolean,
    moveArrowVisible: boolean,
    moveArrowColor: AnnotationColor,
    animated: boolean,
    colorset: Colorset,
    pieceset: Pieceset,

    interactionMode?: 'movePieces' | 'clickSquares' | 'editArrows' | 'playMoves',
    editedArrowColor?: AnnotationColor, // mandatory if `interactionMode === 'editArrows'`

    onPieceMoved?: (from: Square, to: Square) => void,
    onSquareClicked?: (square: Square) => void,
    onArrowEdited?: (from: Square, to: Square) => void,
    onMovePlayed?: (move: string) => void,
}


interface ChessboardImplState {
    inhibitedSquare?: Square,
    draggedSquare?: Square,
    hoveredSquare?: Square,
    dragPosition?: { x: number, y: number }, // mandatory if `dragged` is defined
    cursorOffset?: { x: number, y: number }, // mandatory if `dragged` is defined
    promotionDrawer?: {
        origin: Square,
        buttons: Piece[],
        builder: (promotion: Piece) => string,
    },
}


/**
 * Implementation of {@link Chessboard}.
 *
 * This implementation assumes that all the parameter sanitization has been performed beforehand.
 * All the logic related to parameter adaptation in presence of small-screen devices is also performed beforehand.
 */
export class ChessboardImpl extends React.Component<ChessboardImplProps, ChessboardImplState> {

    private arrowTipIdSuffix: string = generateRandomId();

    constructor(props: ChessboardImplProps) {
        super(props);
        this.state = {};
    }

    render() {

        let fontSize = 0;

        // Render the squares.
        const squares: React.ReactNode[] = [];
        forEachSquare(sq => squares.push(this.renderSquare(sq)));

        // Render coordinates.
        const rankCoordinates: React.ReactNode[] = [];
        const fileCoordinates: React.ReactNode[] = [];
        if (this.props.coordinateVisible) {
            fontSize = computeCoordinateFontSize(this.props.squareSize);
            for (let i = 0; i < 8; ++i) {
                rankCoordinates.push(this.renderRankCoordinate(fontSize, i));
                fileCoordinates.push(this.renderFileCoordinate(fontSize, i));
            }
        }

        // Render the whole canvas.
        const xmin = Math.round(-RANK_COORDINATE_WIDTH_FACTOR * fontSize);
        const ymin = 0;
        const xmax = this.props.turnVisible ? 9 * this.props.squareSize + Math.round(TURN_FLAG_SPACING_FACTOR * this.props.squareSize) : 8 * this.props.squareSize;
        const ymax = 8 * this.props.squareSize + Math.round(FILE_COORDINATE_HEIGHT_FACTOR * fontSize);
        const viewBox = `${xmin} ${ymin} ${xmax - xmin} ${ymax - ymin}`;
        return (
            <svg className="kokopu-chessboard" viewBox={viewBox} width={xmax - xmin} height={ymax - ymin}>
                <defs>
                    {this.renderArrowTip('b')}
                    {this.renderArrowTip('g')}
                    {this.renderArrowTip('r')}
                    {this.renderArrowTip('y')}
                </defs>
                {squares}
                {rankCoordinates}
                {fileCoordinates}
                {this.renderBoardContent()}
            </svg>
        );
    }

    private renderBoardContent() {
        if (this.props.move && this.props.animated) {
            return (
                <Motion duration={MOTION_DURATION}>
                    {motionCursor => (motionCursor === 1 ? this.renderBoardContentStill() : this.renderBoardContentAnimated(motionCursor))}
                </Motion>
            );
        }
        else {
            return this.renderBoardContentStill();
        }
    }

    /**
     * Render the board content during the animation.
     */
    private renderBoardContentAnimated(motionCursor: number) {
        const pieces: React.ReactNode[] = [];
        forEachSquare(sq => pieces.push(this.renderPieceAnimated(motionCursor, sq)));
        return (
            <>
                {pieces}
                {this.renderMoveArrow(motionCursor)}
                {this.renderTurnFlag(oppositeColor(this.props.position.turn()))}
            </>
        );
    }

    /**
     * Render the board content when the animation has been completed (or if there is no animation).
     */
    private renderBoardContentStill() {

        const positionStill = this.getPositionStill();

        // Render the square-related objects.
        const pieces: React.ReactNode[] = [];
        const handles: React.ReactNode[] = [];
        forEachSquare(sq => {
            pieces.push(this.renderPiece(positionStill, sq));
            if (this.props.interactionMode) {
                handles.push(this.renderSquareHandle(positionStill, sq));
            }
        });
        return (
            <>
                {this.renderSquareMarkers()}
                {this.renderHoveredSquare()}
                {pieces}
                {this.renderTextMarkers()}
                {this.renderArrowMarkers()}
                {this.renderMoveArrow(1)}
                {handles}
                {this.renderPromotionDrawer(positionStill)}
                {this.renderDraggedPiece(positionStill)}
                {this.renderDraggedArrow()}
                {this.renderTurnFlag(positionStill.turn())}
            </>
        );
    }

    private renderSquare(sq: Square) {
        const { x, y } = this.getSquareCoordinates(sq);
        return <rect key={sq} x={x} y={y} width={this.props.squareSize} height={this.props.squareSize} fill={this.props.colorset[squareColor(sq)]} />;
    }

    private renderHoveredSquare() {
        if (!this.state.hoveredSquare) {
            return undefined;
        }
        const { x, y } = this.getSquareCoordinates(this.state.hoveredSquare);
        const thickness = Math.max(2, Math.round(HOVER_MARKER_THICKNESS_FACTOR * this.props.squareSize));
        const size = this.props.squareSize - thickness;
        const color = this.getColorForAnnotation(this.props.interactionMode === 'editArrows' ? this.props.editedArrowColor! : this.props.moveArrowColor);
        return <rect className="kokopu-hoveredSquare" x={x + thickness / 2} y={y + thickness / 2} width={size} height={size} stroke={color} strokeWidth={thickness} />;
    }

    private renderPiece(positionStill: Position, sq: Square) {
        const cp = positionStill.square(sq);
        if (cp === '-' || this.state.inhibitedSquare === sq) {
            return undefined;
        }
        const { x, y } = this.getSquareCoordinates(sq);
        return <image key={'piece-' + sq} x={x} y={y} width={this.props.squareSize} height={this.props.squareSize} href={this.props.pieceset[cp]} />;
    }

    private renderPieceAnimated(motionCursor: number, sq: Square) {
        const move = this.props.move!;
        let cp = this.props.position.square(sq);
        if (cp === '-' || move.to() === sq || (move.isEnPassant() && move.enPassantSquare() === sq)) {
            return undefined;
        }
        let { x, y } = this.getSquareCoordinates(sq);
        if (sq === move.from()) {
            const { x: xTo, y: yTo } = this.getSquareCoordinates(move.to());
            x = xTo * motionCursor + x * (1 - motionCursor);
            y = yTo * motionCursor + y * (1 - motionCursor);
            if (move.isPromotion() && motionCursor > 0.8) {
                cp = move.coloredPromotion();
            }
        }
        else if (move.isCastling() && sq === move.rookFrom()) {
            const { x: xTo, y: yTo } = this.getSquareCoordinates(move.rookTo());
            x = xTo * motionCursor + x * (1 - motionCursor);
            y = yTo * motionCursor + y * (1 - motionCursor);
        }
        return <image key={'piece-' + sq} x={x} y={y} width={this.props.squareSize} height={this.props.squareSize} href={this.props.pieceset[cp]} />;
    }

    private renderDraggedPiece(positionStill: Position) {
        if ((this.props.interactionMode !== 'movePieces' && this.props.interactionMode !== 'playMoves') || !this.state.draggedSquare) {
            return undefined;
        }
        const cp = positionStill.square(this.state.draggedSquare) as ColoredPiece; // `draggedSquare` cannot correspond to an empty square
        let { x, y } = this.getSquareCoordinates(this.state.draggedSquare);
        x = Math.min(Math.max(x + this.state.dragPosition!.x, 0), 7 * this.props.squareSize);
        y = Math.min(Math.max(y + this.state.dragPosition!.y, 0), 7 * this.props.squareSize);
        return <image className="kokopu-pieceDraggable kokopu-dragging" x={x} y={y} width={this.props.squareSize} height={this.props.squareSize} href={this.props.pieceset[cp]} />;
    }

    private renderDraggedArrow() {
        if (this.props.interactionMode !== 'editArrows' || !this.state.draggedSquare) {
            return undefined;
        }
        const { x, y } = this.getSquareCoordinates(this.state.draggedSquare);
        const xFrom = x + this.props.squareSize / 2;
        const yFrom = y + this.props.squareSize / 2;
        const xTo = Math.min(Math.max(x + this.state.dragPosition!.x + this.state.cursorOffset!.x, this.props.squareSize / 2), 15 * this.props.squareSize / 2);
        const yTo = Math.min(Math.max(y + this.state.dragPosition!.y + this.state.cursorOffset!.y, this.props.squareSize / 2), 15 * this.props.squareSize / 2);
        if (xFrom === xTo && yFrom === yTo) {
            return undefined;
        }
        const strokeWidth = this.props.squareSize * STROKE_THICKNESS_FACTOR;
        const editArrowColor = this.props.editedArrowColor!;
        return (
            <line
                className="kokopu-annotation kokopu-arrow kokopu-arrowDraggable kokopu-dragging" x1={xFrom} y1={yFrom} x2={xTo} y2={yTo}
                strokeWidth={strokeWidth} stroke={this.getColorForAnnotation(editArrowColor)} markerEnd={`url(#${this.getArrowTipId(editArrowColor)})`}
            />
        );
    }

    private renderPromotionDrawer(positionStill: Position) {
        if (!this.state.promotionDrawer) {
            return undefined;
        }
        const { x, y } = this.getSquareCoordinates(this.state.promotionDrawer.origin);
        const inverted = positionStill.turn() === (this.props.flipped ? 'w' : 'b'); // false==top-to-bottom true==bottom-to-top
        const y0 = inverted ? y - this.props.squareSize * (this.state.promotionDrawer.buttons.length - 1) : y;
        const buttons = this.state.promotionDrawer.buttons.map((p, i) => {
            const cp = (positionStill.turn() + p) as ColoredPiece;
            return (
                <image
                    key={'drawer-piece-' + p} className="kokopu-clickable" x={x} y={y + i * (inverted ? -this.props.squareSize : this.props.squareSize)}
                    width={this.props.squareSize} height={this.props.squareSize} href={this.props.pieceset[cp]} onClick={() => this.handleDrawerButtonClicked(p)}
                />
            );
        });
        return (
            <>
                <rect
                    className="kokopu-handle"
                    x={0} y={0} width={this.props.squareSize * 8} height={this.props.squareSize * 8}
                    onClick={() => this.handleDrawerCancelButtonClicked()}
                />
                <rect
                    x={x} y={y0} width={this.props.squareSize} height={this.props.squareSize * this.state.promotionDrawer.buttons.length}
                    fill={this.props.colorset.b}
                />
                <rect
                    className="kokopu-drawerMask"
                    x={x} y={y0} width={this.props.squareSize} height={this.props.squareSize * this.state.promotionDrawer.buttons.length}
                    fill={this.props.colorset.w}
                />
                {buttons}
            </>
        );
    }

    private renderSquareHandle(positionStill: Position, sq: Square) {
        const { x, y } = this.getSquareCoordinates(sq);
        const dragEnabledForMovePieces = this.props.interactionMode === 'movePieces' && positionStill.square(sq) !== '-';
        const dragEnabledForEditArrows = this.props.interactionMode === 'editArrows';
        const dragEnabledForPlayMoves = this.props.interactionMode === 'playMoves' && !this.state.promotionDrawer && positionStill.isLegal() &&
            positionStill.square(sq).startsWith(positionStill.turn());
        if (dragEnabledForMovePieces || dragEnabledForEditArrows || dragEnabledForPlayMoves) {
            return (
                <Draggable
                    key={'handle-' + sq}
                    x={x} y={y} width={this.props.squareSize} height={this.props.squareSize}
                    isArrowHandle={dragEnabledForEditArrows}
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
                    key={'handle-' + sq} className="kokopu-handle kokopu-clickable"
                    x={x} y={y} width={this.props.squareSize} height={this.props.squareSize}
                    onClick={() => this.handleSquareClicked(sq)}
                />
            );
        }
        else {
            return undefined;
        }
    }

    private renderSquareMarkers() {
        if (!this.props.squareMarkers) {
            return undefined;
        }
        return Object.entries(this.props.squareMarkers).map(([ sq, color ]) => {
            const { x, y } = this.getSquareCoordinates(sq as Square);
            return (
                <rect
                    key={'sqm-' + sq} className="kokopu-annotation"
                    x={x} y={y} width={this.props.squareSize} height={this.props.squareSize}
                    fill={this.getColorForAnnotation(color)}
                />
            );
        });
    }

    private renderTextMarkers() {
        if (!this.props.textMarkers) {
            return undefined;
        }
        return Object.entries(this.props.textMarkers).map(([ sq, marker ]) => {
            let { x, y } = this.getSquareCoordinates(sq as Square);
            x += this.props.squareSize / 2;
            y += this.props.squareSize / 2;
            return (
                <g key={'txtm-' + sq} className="kokopu-annotation">
                    <AnnotationSymbolShape x={x} y={y} size={this.props.squareSize} symbol={marker.symbol} color={this.getColorForAnnotation(marker.color)} />
                </g>
            );
        });
    }

    private renderArrowMarkers() {
        if (!this.props.arrowMarkers) {
            return undefined;
        }
        const strokeWidth = this.props.squareSize * STROKE_THICKNESS_FACTOR;
        return Object.entries(this.props.arrowMarkers).map(([ vect, color ]) => {
            const from = vect.substring(0, 2) as Square;
            const to = vect.substring(2, 4) as Square;
            if (from === to) {
                return undefined;
            }
            let { x: xFrom, y: yFrom } = this.getSquareCoordinates(from);
            let { x: xTo, y: yTo } = this.getSquareCoordinates(to);
            xFrom += this.props.squareSize / 2;
            yFrom += this.props.squareSize / 2;
            xTo += this.props.squareSize / 2;
            yTo += this.props.squareSize / 2;
            xTo += Math.sign(xFrom - xTo) * ARROW_TIP_OFFSET_FACTOR * this.props.squareSize;
            yTo += Math.sign(yFrom - yTo) * ARROW_TIP_OFFSET_FACTOR * this.props.squareSize;
            return (
                <line
                    key={'arm-' + vect} className="kokopu-annotation kokopu-arrow"
                    x1={xFrom} y1={yFrom} x2={xTo} y2={yTo}
                    strokeWidth={strokeWidth} stroke={this.getColorForAnnotation(color)}
                    markerEnd={`url(#${this.getArrowTipId(color)})`}
                />
            );
        });
    }

    private renderMoveArrow(motionCursor: number) {
        if (!this.props.move || motionCursor < 0.1 || !this.props.moveArrowVisible || this.props.move.from() === this.props.move.to()) {
            return undefined;
        }
        const strokeWidth = this.props.squareSize * STROKE_THICKNESS_FACTOR;
        let { x: xFrom, y: yFrom } = this.getSquareCoordinates(this.props.move.from());
        xFrom += this.props.squareSize / 2;
        yFrom += this.props.squareSize / 2;
        let { x: xTo, y: yTo } = this.getSquareCoordinates(this.props.move.to());
        xTo += this.props.squareSize / 2;
        yTo += this.props.squareSize / 2;
        xTo += Math.sign(xFrom - xTo) * ARROW_TIP_OFFSET_FACTOR * this.props.squareSize;
        yTo += Math.sign(yFrom - yTo) * ARROW_TIP_OFFSET_FACTOR * this.props.squareSize;
        const x = xTo * motionCursor + xFrom * (1 - motionCursor);
        const y = yTo * motionCursor + yFrom * (1 - motionCursor);
        return (
            <line
                className="kokopu-annotation kokopu-arrow"
                x1={xFrom} y1={yFrom} x2={x} y2={y}
                strokeWidth={strokeWidth} stroke={this.getColorForAnnotation(this.props.moveArrowColor)}
                markerEnd={`url(#${this.getArrowTipId(this.props.moveArrowColor)})`}
            />
        );
    }

    private renderArrowTip(color: AnnotationColor) {
        return <ArrowTip id={this.getArrowTipId(color)} color={this.getColorForAnnotation(color)} />;
    }

    private renderTurnFlag(turn: Color) {
        if (!this.props.turnVisible) {
            return undefined;
        }
        const x = 8 * this.props.squareSize + Math.round(TURN_FLAG_SPACING_FACTOR * this.props.squareSize);
        const y = turn === (this.props.flipped ? 'b' : 'w') ? 7 * this.props.squareSize : 0;
        return <image key={'turn-' + turn} x={x} y={y} width={this.props.squareSize} height={this.props.squareSize} href={this.getURLForTurnFlag(turn)} />;
    }

    private renderRankCoordinate(fontSize: number, rank: number) {
        const x = Math.round(-RANK_COORDINATE_WIDTH_FACTOR * fontSize) / 2;
        const y = (this.props.flipped ? rank + 0.5 : 7.5 - rank) * this.props.squareSize;
        const label = RANK_LABELS[rank];
        return <text key={'rank-' + label} className="kokopu-coordinate" x={x} y={y} fontSize={fontSize}>{label}</text>;
    }

    private renderFileCoordinate(fontSize: number, file: number) {
        const x = (this.props.flipped ? 7.5 - file : 0.5 + file) * this.props.squareSize;
        const y = 8 * this.props.squareSize + Math.round(FILE_COORDINATE_HEIGHT_FACTOR * fontSize) / 2;
        const label = FILE_LABELS[file];
        return <text key={'file-' + label} className="kokopu-coordinate" x={x} y={y} fontSize={fontSize}>{label}</text>;
    }

    private handleDragStart(sq: Square, x0: number, y0: number) {
        this.setState({
            inhibitedSquare: this.props.interactionMode === 'movePieces' || this.props.interactionMode === 'playMoves' ? sq : undefined,
            draggedSquare: sq,
            hoveredSquare: sq,
            cursorOffset: { x: x0, y: y0 },
            dragPosition: { x: 0, y: 0 },
        });
    }

    private handleDrag(sq: Square, dx: number, dy: number) {
        const { x, y } = this.getSquareCoordinates(sq);
        const targetSq = this.getSquareAt(x + dx + this.state.cursorOffset!.x, y + dy + this.state.cursorOffset!.y);
        this.setState({
            hoveredSquare: targetSq,
            dragPosition: { x: dx, y: dy },
        });
    }

    private handleDragStop(sq: Square, dx: number, dy: number) {
        const { x, y } = this.getSquareCoordinates(sq);
        const targetSq = this.getSquareAt(x + dx + this.state.cursorOffset!.x, y + dy + this.state.cursorOffset!.y);
        this.setState({
            inhibitedSquare: undefined,
            draggedSquare: undefined,
            hoveredSquare: undefined,
        });
        if (sq === targetSq || !targetSq) {
            return;
        }
        if (this.props.interactionMode === 'movePieces' && this.props.onPieceMoved) {
            this.props.onPieceMoved(sq, targetSq);
        }
        else if (this.props.interactionMode === 'editArrows' && this.props.onArrowEdited) {
            this.props.onArrowEdited(sq, targetSq);
        }
        else if (this.props.interactionMode === 'playMoves') {
            const positionStill = this.getPositionStill();
            const info = positionStill.isMoveLegal(sq, targetSq);
            if (!info) {
                return;
            }
            switch (info.status) {

                // Regular move.
                case 'regular':
                    if (this.props.onMovePlayed) {
                        this.props.onMovePlayed(positionStill.notation(info()));
                    }
                    break;

                // Promotion move.
                case 'promotion':
                    this.setState({
                        inhibitedSquare: sq, // The moving pawn must not be visible while the promotion drawer is opened.
                        promotionDrawer: {
                            origin: targetSq,
                            buttons: positionStill.variant() === 'antichess' ? [ 'q', 'r', 'b', 'n', 'k' ] : [ 'q', 'r', 'b', 'n' ],
                            builder: piece => positionStill.notation(info(piece)),
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

    private handleDragCanceled() {
        this.setState({
            inhibitedSquare: undefined,
            draggedSquare: undefined,
            hoveredSquare: undefined,
        });
    }

    private handleDrawerCancelButtonClicked() {
        this.setState({
            inhibitedSquare: undefined,
            promotionDrawer: undefined,
        });
    }

    private handleDrawerButtonClicked(piece: Piece) {
        const builder = this.state.promotionDrawer!.builder;
        this.setState({
            inhibitedSquare: undefined,
            promotionDrawer: undefined,
        });
        if (this.props.onMovePlayed) {
            this.props.onMovePlayed(builder(piece));
        }
    }

    private handleSquareClicked(sq: Square) {
        if (this.props.onSquareClicked) {
            this.props.onSquareClicked(sq);
        }
    }

    /**
     * Return the position obtained after playing the move passed among the component props, if any.
     */
    private getPositionStill() {
        if (!this.props.move) {
            return this.props.position;
        }
        const result = new Position(this.props.position);
        result.play(this.props.move);
        return result;
    }

    /**
     * Return the (x,y) coordinates of the given square in the SVG canvas.
     */
    private getSquareCoordinates(sq: Square) {
        const { file, rank } = squareToCoordinates(sq);
        const x = this.props.flipped ? (7 - file) * this.props.squareSize : file * this.props.squareSize;
        const y = this.props.flipped ? rank * this.props.squareSize : (7 - rank) * this.props.squareSize;
        return { x: x, y: y };
    }

    /**
     * Return the square at the given location.
     */
    private getSquareAt(x: number, y: number) {
        const file = this.props.flipped ? 7 - Math.floor(x / this.props.squareSize) : Math.floor(x / this.props.squareSize);
        const rank = this.props.flipped ? Math.floor(y / this.props.squareSize) : 7 - Math.floor(y / this.props.squareSize);
        return file >= 0 && file < 8 && rank >= 0 && rank < 8 ? coordinatesToSquare(file, rank) : undefined;
    }

    /**
     * Return the DOM ID of an arrow tip with the given color.
     */
    private getArrowTipId(color: AnnotationColor) {
        return `kokopu-arrowTip-${color}-${this.arrowTipIdSuffix}`;
    }

    /**
     * Return the [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) to use for the given symbolic annotation color.
     */
    private getColorForAnnotation(color: AnnotationColor) {
        return this.props.colorset[('c' + color) as `c${AnnotationColor}`];
    }

    /**
     * Return the URL to the image to use for the turn flag of the given color.
     */
    private getURLForTurnFlag(color: Color) {
        return this.props.pieceset[(color + 'x') as `${Color}x`];
    }
}


/**
 * Return the size of the chessboard, assuming it is built with the given attributes.
 */
export function chessboardSize(squareSize: number, coordinateVisible: boolean, turnVisible: boolean) {
    let width = 8 * squareSize;
    let height = 8 * squareSize;
    if (turnVisible) {
        width += squareSize + Math.round(TURN_FLAG_SPACING_FACTOR * squareSize);
    }
    if (coordinateVisible) {
        const fontSize = computeCoordinateFontSize(squareSize);
        width += Math.round(RANK_COORDINATE_WIDTH_FACTOR * fontSize);
        height += Math.round(FILE_COORDINATE_HEIGHT_FACTOR * fontSize);
    }
    return { width: width, height: height };
}


/**
 * Return the font size to use for coordinates assuming the given square size.
 */
function computeCoordinateFontSize(squareSize: number) {
    return squareSize <= 32 ? 8 : 8 + (squareSize - 32) * 0.2;
}
