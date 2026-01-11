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
import { testApp } from '../common/test_app';
import { Chessboard } from '../../../dist/lib/index';


/**
 * REMARK: do NOT display the chessboards by default, because:
 * - we want to know which one plays the sound,
 * - there could be some issues with the auto-play policies of browsers.
 */
function TestComponent({ move }: { move?: string }) {

    const [ clicked, setClicked ] = React.useState(false);

    function onClick() {
        window['__kokopu_debug_sound'] = '';
        setClicked(true);
    }

    const id = `chessboard-actionButton-${move === undefined ? 'noMove' : 'withMove'}`;
    return clicked ? <Chessboard move={move} sound /> : <button id={id} onClick={onClick}>Click here</button>;
}


testApp([ /* eslint-disable react/jsx-key */
    <TestComponent />,
    <TestComponent move="e4" />,
]); /* eslint-enable react/jsx-key */
