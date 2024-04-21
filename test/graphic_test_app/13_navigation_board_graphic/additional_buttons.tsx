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
import { setSandbox, testApp } from '../common/test_app';
import { NavigationBoard } from '../../../dist/lib/index';

import pgn from '../common/games.pgn';

testApp([ /* eslint-disable react/jsx-key */
    <NavigationBoard game={pgn} additionalButtons={{ iconPath: 'M 11 11 H 21 V 21 H 11 Z' }} />,
    <NavigationBoard game={pgn} additionalButtons={[
        { iconPath: 'M 11 11 H 21 V 21 H 11 Z', tooltip: 'Button 0', enabled: true },
        { iconPath: 'M 9 16 L 16 9 L 23 16 L 16 23 Z', tooltip: 'Button A', onClick: () => setSandbox('Button A clicked') },
        'spacer',
        { iconPath: 'M 16 22 L 10 11 H 22 Z', tooltip: 'Button B', onClick: () => setSandbox('Button B clicked') },
        'spacer',
        'spacer',
        { iconPath: 'M 16 10 L 22 21 H 10 Z', tooltip: 'Button C', enabled: false, onClick: () => setSandbox('Button C clicked') },
    ]} />,
    <NavigationBoard game={pgn} additionalButtons={
        /* eslint-disable @typescript-eslint/no-explicit-any */ 'not a button' as any /* eslint-enable @typescript-eslint/no-explicit-any */
    } />,
]); /* eslint-enable react/jsx-key */
