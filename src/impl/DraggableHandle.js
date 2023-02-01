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


import PropTypes from 'prop-types';
import React from 'react';


/**
 * Invisible SVG rectangular handle that captures drag events.
 */
export default class DraggableHandle extends React.Component {

	constructor(props) {
		super(props);
		this.dragData = null;
	}

	componentDidMount() {
		if (!this.windowListeners) {
			this.windowListeners = {
				mouseMove: evt => this.handleMouseMove(evt),
				mouseUp: evt => this.handleMouseUp(evt),
			};
			window.addEventListener('mousemove', this.windowListeners.mouseMove);
			window.addEventListener('mouseup', this.windowListeners.mouseUp);
		}
		this.dragData = null;
	}

	componentWillUnmount() {
		if (this.windowListeners) {
			window.removeEventListener('mousemove', this.windowListeners.mouseMove);
			window.removeEventListener('mouseup', this.windowListeners.mouseUp);
			this.windowListeners = null;
		}
	}

	render() {
		let classNames = [ 'kokopu-handle', this.props.isArrowHandle ? 'kokopu-arrowDraggable' : 'kokopu-pieceDraggable' ];
		return (
			<rect className={classNames.join(' ')} x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height}
				onMouseDown={evt => this.handleMouseDown(evt)}
			/>
		);
	}

	handleMouseDown(evt) {
		if (this.dragData || evt.button !== 0) {
			return;
		}
		evt.preventDefault();
		this.dragData = {
			originX: evt.clientX,
			originY: evt.clientY,
		};
		let handleBoundary = evt.target.getBoundingClientRect();
		let x0 = evt.clientX - handleBoundary.left;
		let y0 = evt.clientY - handleBoundary.top;
		if (this.props.onDragStart) {
			this.props.onDragStart(x0, y0);
		}
	}

	handleMouseMove(evt) {
		if (!this.dragData) {
			return;
		}
		evt.preventDefault();
		let { originX, originY } = this.dragData;
		if (this.props.onDrag) {
			this.props.onDrag(evt.clientX - originX, evt.clientY - originY);
		}
	}

	handleMouseUp(evt) {
		if (!this.dragData) {
			return;
		}
		evt.preventDefault();
		let { originX, originY } = this.dragData;
		this.dragData = null;
		if (this.props.onDragStop) {
			this.props.onDragStop(evt.clientX - originX, evt.clientY - originY);
		}
	}

}

DraggableHandle.propTypes = {

	/**
	 * Initial X coordinate of the handle.
	 */
	x: PropTypes.number.isRequired,

	/**
	 * Initial Y coordinate of the handle.
	 */
	y: PropTypes.number.isRequired,

	/**
	 * Width of the handle.
	 */
	width: PropTypes.number.isRequired,

	/**
	 * Height of the handle.
	 */
	height: PropTypes.number.isRequired,

	/**
	 * `true` if the handle corresponds to a draggable arrow, `false` if it corresponds to a draggable piece.
	 */
	isArrowHandle: PropTypes.bool.isRequired,

	/**
	 * Callback invoked when the drag starts.
	 *
	 * @param {number} x0 X-coordinate (relative to the handle) at which the drag has been initiated.
	 * @param {number} y0 X-coordinate (relative to the handle) at which the drag has been initiated.
	 */
	onDragStart: PropTypes.func,

	/**
	 * Callback invoked during the drag.
	 *
	 * @param {number} dx X-coordinate of the translation vector applied during the drag.
	 * @param {number} dy Y-coordinate of the translation vector applied during the drag.
	 */
	onDrag: PropTypes.func,

	/**
	 * Callback invoked when the drag stops.
	 *
	 * @param {number} dx X-coordinate of the translation vector applied during the drag.
	 * @param {number} dy Y-coordinate of the translation vector applied during the drag.
	 */
	onDragStop: PropTypes.func,
};
