/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2026  Yoann Le Montagner <yo35 -at- melix.net>       *
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

import { IllegalArgument } from '../exception';
import { sanitizeString, sanitizeBoundedInteger } from '../sanitization';
import { generateRandomId } from '../util';
import { MIN_SQUARE_SIZE, MAX_SQUARE_SIZE } from '../types';

import { ArrowTip } from './ArrowTip';

import './arrow.css';

const ARROW_THICKNESS_FACTOR = 0.2;


export interface ArrowMarkerIconProps {

    /**
     * Width and height (in pixels) of the icon.
     */
    size: number,

    /**
     * [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) to use to colorize the icon (for example: `'green'`, `'#ff0000'`...).
     */
    color: string,
}


/**
 * SVG icon representing an arrow marker.
 */
export class ArrowMarkerIcon extends React.Component<ArrowMarkerIconProps> {

    static defaultProps: Partial<ArrowMarkerIconProps> = {
        color: 'currentcolor',
    };

    private arrowTipId = generateRandomId();

    render() {

        // Sanitize the inputs.
        const size = sanitizeBoundedInteger(this.props.size, MIN_SQUARE_SIZE, MAX_SQUARE_SIZE, () => new IllegalArgument('ArrowMarkerIcon', 'size'));
        const color = sanitizeString(this.props.color);

        // Render the component.
        const halfThickness = size * ARROW_THICKNESS_FACTOR / 2;
        const viewBox = `0 0 ${size} ${size}`;
        return (
            <svg className="kokopu-arrowMarkerIcon" viewBox={viewBox} width={size} height={size}>
                <defs>
                    <ArrowTip id={this.arrowTipId} color={this.props.color} />
                </defs>
                <line
                    className="kokopu-arrow"
                    x1={halfThickness} y1={size / 2} x2={size - halfThickness * 3} y2={size / 2}
                    stroke={color} strokeWidth={halfThickness * 2}
                    markerEnd={`url(#${this.arrowTipId})`}
                />
            </svg>
        );
    }
}
