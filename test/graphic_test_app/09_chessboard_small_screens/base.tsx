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
import { testApp } from '../common/test_app';
import { Chessboard } from '../../../dist/lib/index';

// WARNING: avoid window width < 600 (the selenium-controlled window has some issues in this case).
const limits = [
    { width: 690, squareSize: 16 },
    { width: 700, turnVisible: false },
    { width: 710, squareSize: 24, coordinateVisible: false },
    { width: 720, squareSize: 44 },
    { width: 730, squareSize: 48, coordinateVisible: true },
    { width: 740, squareSize: 24, coordinateVisible: false },
    { width: 750, squareSize: 32 },
];

testApp([ /* eslint-disable react/jsx-key */
    <Chessboard squareSize={50} smallScreenLimits={limits} />,
    <Chessboard
        smallScreenLimits={/* eslint-disable @typescript-eslint/no-explicit-any */ 42 as any /* eslint-enable @typescript-eslint/no-explicit-any */}
    />,
]); /* eslint-enable react/jsx-key */
