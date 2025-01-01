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
import { testApp } from '../common/test_app';
import { Chessboard, ChessboardProps } from '../../../dist/lib/index';

const limits1 = [
    { width: 750, squareSize: 24, coordinateVisible: false },
];

const limits2 = [
    { width: 750, squareSize: 27, turnVisible: false },
];

function AuxilliaryComponent({ squareSize, coordinateVisible, turnVisible }: Pick<ChessboardProps, 'squareSize' | 'coordinateVisible' | 'turnVisible'>) {
    return (
        <>
            <div>{`Square size: ${squareSize}`}</div>
            <div>{`Coordinates: ${coordinateVisible}`}</div>
            <div>{`Turn: ${turnVisible}`}</div>
        </>
    );
}

testApp([ /* eslint-disable react/jsx-key */
    <Chessboard squareSize={30} smallScreenLimits={limits1} topComponent={AuxilliaryComponent} />,
    <Chessboard squareSize={30} smallScreenLimits={limits2} bottomComponent={AuxilliaryComponent} />,
]); /* eslint-enable react/jsx-key */
