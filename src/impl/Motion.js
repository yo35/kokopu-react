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

const DEBUG_KEY = '__kokopu_debug_freeze_motion';


/**
 * Wrap some animated content.
 */
export default class Motion extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			cursor: 0,
		};
		this.animationFrameId = null;
		this.cursorStop = 1;

		// WARNING: this hack exists only for testing purposes. DO NOT USE IT IN PRODUCTION.
		if (typeof window[DEBUG_KEY] === 'number' && window[DEBUG_KEY] >= 0 && window[DEBUG_KEY] <= 1) {
			this.cursorStop = window[DEBUG_KEY];
		}
	}

	componentDidMount() {
		this.animationFrameId = window.requestAnimationFrame(ts => this.handleAnimationStep(ts));
	}

	componentWillUnmount() {
		if (this.animationFrameId !== null) {
			window.cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	handleAnimationStep(timestamp) {
		if (this.initialTimestamp === undefined) {
			this.initialTimestamp = timestamp;
		}

		// Compute the animation cursor and update the state.
		let cursor = (timestamp - this.initialTimestamp) / this.props.duration;
		if (cursor < 0) {
			cursor = 0;
		}
		else if (cursor > this.cursorStop) {
			cursor = this.cursorStop;
		}
		this.setState({ cursor: cursor });

		// Schedule the next animation frame if necessary.
		if (cursor === this.cursorStop) {
			this.animationFrameId = null;
		}
		else {
			this.animationFrameId = window.requestAnimationFrame(ts => this.handleAnimationStep(ts));
		}
	}

	render() {
		return this.props.children(this.state.cursor);
	}
}

Motion.propTypes = {

	/**
	 * Duration of the animation. Must be > 0.
	 */
	duration: PropTypes.number.isRequired,

	/**
	 * Factory for the content being animated. The animation cursor is guaranteed to be valued between 0 and 1 inclusive.
	 */
	children: PropTypes.func.isRequired,
};
