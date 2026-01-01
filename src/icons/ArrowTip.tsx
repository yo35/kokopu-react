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


interface ArrowTipProps {

    /**
     * ID of the element.
     */
    id: string,

    /**
     * [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) to use to colorize the shape (for example: `'green'`, `'#ff0000'`...).
     */
    color: string,
}


/**
 * Tip of the arrow markers.
 */
export function ArrowTip({ id, color }: ArrowTipProps) {
    return (
        <marker id={id} markerWidth={4} markerHeight={4} refX={2.5} refY={2} orient="auto">
            <path fill={color} d="M 4,2 L 0,4 L 1,2 L 0,0 Z" />
        </marker>
    );
}
