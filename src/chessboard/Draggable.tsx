/* -------------------------------------------------------------------------- *
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
 * -------------------------------------------------------------------------- */


import * as React from 'react';


interface DraggableProps {

	/**
	 * Initial X coordinate of the handle.
	 */
	x: number;

	/**
	 * Initial Y coordinate of the handle.
	 */
	y: number;

	/**
	 * Width of the handle.
	 */
	width: number;

	/**
	 * Height of the handle.
	 */
	height: number;

	/**
	 * `true` if the handle corresponds to a draggable arrow, `false` if it corresponds to a draggable piece.
	 */
	isArrowHandle: boolean;

	/**
	 * Callback invoked when the drag starts. `x0` and `y0` correspond to the coordinates (relative to the hande) at which the drag has been initiated.
	 */
	onDragStart?: (x0: number, y0: number) => void;

	/**
	 * Callback invoked during the drag. `dx` and `dy` correspond to the coordinates of the drag translation vector.
	 */
	onDrag?: (dx: number, dy: number) => void;

	/**
	 * Callback invoked when the drag stops. `dx` and `dy` correspond to the coordinates of the drag translation vector.
	 */
	onDragStop?: (dx: number, dy: number) => void;

	/**
	 * Callback invoked when the drag is canceled.
	 */
	onDragCanceled?: () => void;
}


interface InnerListeners {
	mouseDown: (evt: MouseEvent) => void;
	mouseMove: (evt: MouseEvent) => void;
	mouseUp: (evt: MouseEvent) => void;
	touchStart: (evt: TouchEvent) => void;
	touchMove: (evt: TouchEvent) => void;
	touchEnd: (evt: TouchEvent) => void;
	touchCancel: (evt: TouchEvent) => void;
}


interface DragData {
	originX: number;
	originY: number;
}


interface PageCoordinates {
	pageX: number;
	pageY: number;
}


interface ClientCoordinates {
	clientX: number;
	clientY: number;
}


/**
 * Invisible SVG rectangular handle that captures drag events.
 */
export class Draggable extends React.Component<DraggableProps> {

	private innerRef: React.RefObject<SVGRectElement>;
	private innerListeners?: InnerListeners;
	private dragData?: DragData;

	constructor(props: DraggableProps) {
		super(props);
		this.innerRef = React.createRef();
	}

	componentDidMount() {
		if (!this.innerListeners) {
			this.innerListeners = {
				mouseDown: evt => this.handleMouseDown(evt),
				mouseMove: evt => this.handleMouseMove(evt),
				mouseUp: evt => this.handleMouseUp(evt),
				touchStart: evt => this.handleTouchStart(evt),
				touchMove: evt => this.handleTouchMove(evt),
				touchEnd: evt => this.handleTouchEnd(evt),
				touchCancel: evt => this.handleTouchCancel(evt),
			};
			this.innerRef.current!.addEventListener('mousedown', this.innerListeners.mouseDown);
			window.addEventListener('mousemove', this.innerListeners.mouseMove);
			window.addEventListener('mouseup', this.innerListeners.mouseUp);
			this.innerRef.current!.addEventListener('touchstart', this.innerListeners.touchStart, { passive: false });
			window.addEventListener('touchmove', this.innerListeners.touchMove, { passive: false });
			window.addEventListener('touchend', this.innerListeners.touchEnd);
			window.addEventListener('touchcancel', this.innerListeners.touchCancel);
		}
		this.dragData = undefined;
	}

	componentWillUnmount() {
		if (this.innerListeners) {
			this.innerRef.current!.removeEventListener('mousedown', this.innerListeners.mouseDown);
			window.removeEventListener('mousemove', this.innerListeners.mouseMove);
			window.removeEventListener('mouseup', this.innerListeners.mouseUp);
			this.innerRef.current!.removeEventListener('touchstart', this.innerListeners.touchStart);
			window.removeEventListener('touchmove', this.innerListeners.touchMove);
			window.removeEventListener('touchend', this.innerListeners.touchEnd);
			window.removeEventListener('touchcancel', this.innerListeners.touchCancel);
			this.innerListeners = undefined;
		}
	}

	render() {
		const classNames = [ 'kokopu-handle', this.props.isArrowHandle ? 'kokopu-arrowDraggable' : 'kokopu-pieceDraggable' ];
		return <rect ref={this.innerRef} className={classNames.join(' ')} x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height} />;
	}

	private handleTouchStart(evt: TouchEvent) {
		if (this.dragData || evt.touches.length !== 1) {
			return;
		}
		evt.preventDefault();
		this.doInitDrag(evt.target as Element, evt.touches[0]);
	}

	private handleTouchMove(evt: TouchEvent) {
		if (!this.dragData) {
			return;
		}
		evt.preventDefault();
		if (evt.touches.length === 1) {
			this.doUpdateDrag(evt.touches[0]);
		}
		else {
			this.doCancelDrag();
		}
	}

	private handleTouchEnd(evt: TouchEvent) {
		if (!this.dragData) {
			return;
		}
		evt.preventDefault();
		if (evt.touches.length === 0 && evt.changedTouches.length === 1) {
			this.doEndDrag(evt.changedTouches[0]);
		}
		else {
			this.doCancelDrag();
		}
	}

	private handleTouchCancel(evt: TouchEvent) {
		if (!this.dragData) {
			return;
		}
		evt.preventDefault();
		this.doCancelDrag();
	}

	private handleMouseDown(evt: MouseEvent) {
		if (this.dragData || evt.button !== 0) {
			return;
		}
		evt.preventDefault();
		this.doInitDrag(evt.target as Element, evt);
	}

	private handleMouseMove(evt: MouseEvent) {
		if (!this.dragData) {
			return;
		}
		evt.preventDefault();
		this.doUpdateDrag(evt);
	}

	private handleMouseUp(evt: MouseEvent) {
		if (!this.dragData) {
			return;
		}
		evt.preventDefault();
		this.doEndDrag(evt);
	}

	private doInitDrag(target: Element, { pageX, pageY, clientX, clientY }: PageCoordinates & ClientCoordinates) {
		this.dragData = {
			originX: pageX,
			originY: pageY,
		};
		const handleBoundary = target.getBoundingClientRect();
		const x0 = clientX - handleBoundary.left;
		const y0 = clientY - handleBoundary.top;
		if (this.props.onDragStart) {
			this.props.onDragStart(x0, y0);
		}
	}

	private doUpdateDrag({ pageX, pageY }: PageCoordinates) {
		const { originX, originY } = this.dragData!;
		if (this.props.onDrag) {
			this.props.onDrag(pageX - originX, pageY - originY);
		}
	}

	private doEndDrag({ pageX, pageY }: PageCoordinates) {
		const { originX, originY } = this.dragData!;
		this.dragData = undefined;
		if (this.props.onDragStop) {
			this.props.onDragStop(pageX - originX, pageY - originY);
		}
	}

	private doCancelDrag() {
		if (this.props.onDragCanceled) {
			this.props.onDragCanceled();
		}
	}
}
