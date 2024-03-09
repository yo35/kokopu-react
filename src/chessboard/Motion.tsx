/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2024  Yoann Le Montagner <yo35 -at- melix.net>       *
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

const DEBUG_KEY = '__kokopu_debug_freeze_motion';


interface MotionProps {

    /**
     * Duration of the animation. Must be > 0.
     */
    duration: number;

    /**
     * Factory for the content being animated. The animation cursor is guaranteed to be valued between 0 and 1 inclusive.
     */
    children: (cursor: number) => React.ReactNode;
}


interface MotionState {
    cursor: number;
}


/**
 * Wrap some animated content.
 */
export class Motion extends React.Component<MotionProps, MotionState> {

    private animationFrameId?: number;
    private initialTimestamp?: number;
    private cursorStop: number;

    constructor(props: MotionProps) {
        super(props);
        this.state = {
            cursor: 0,
        };
        this.cursorStop = 1;

        // WARNING: this hack exists only for testing purposes. DO NOT USE IT IN PRODUCTION.
        const debugCursorStop = window[ /* eslint-disable @typescript-eslint/no-explicit-any */ DEBUG_KEY as any /* eslint-enable @typescript-eslint/no-explicit-any */ ];
        if (typeof debugCursorStop === 'number' && debugCursorStop >= 0 && debugCursorStop <= 1) {
            this.cursorStop = debugCursorStop;
        }
    }

    componentDidMount() {
        this.animationFrameId = window.requestAnimationFrame(ts => this.handleAnimationStep(ts));
    }

    componentWillUnmount() {
        if (this.animationFrameId !== undefined) {
            window.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = undefined;
        }
    }

    private handleAnimationStep(timestamp: number) {
        if (this.initialTimestamp === undefined) {
            this.initialTimestamp = timestamp;
        }

        // Compute the animation cursor and update the state.
        let cursor = (timestamp - this.initialTimestamp) / this.props.duration;
        // istanbul ignore if
        if (cursor < 0) { // This case is not supposed to happen if timestamps are generated with a monotonic clock.
            cursor = 0;
        }
        else if (cursor > this.cursorStop) {
            cursor = this.cursorStop;
        }
        this.setState({ cursor: cursor });

        // Schedule the next animation frame if necessary.
        if (cursor === this.cursorStop) {
            this.animationFrameId = undefined;
        }
        else {
            this.animationFrameId = window.requestAnimationFrame(ts => this.handleAnimationStep(ts));
        }
    }

    render() {
        return this.props.children(this.state.cursor);
    }
}
