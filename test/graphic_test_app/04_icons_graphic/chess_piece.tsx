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
import { ChessPieceIcon } from '../../../dist/lib/index';

testApp([ /* eslint-disable react/jsx-key */

    <ChessPieceIcon size={44} type="wq" />,
    <ChessPieceIcon size={24} type={[ 'bb', 'wx', 'wx', 'wn', 'bx', 'bk', 'bk' ]} />,
    <ChessPieceIcon size={36} type={[ 'wr', 'wb', 'bq' ]} pieceset="eyes" />,

    <ChessPieceIcon size={ /* eslint-disable @typescript-eslint/no-explicit-any */ 'not-a-number' as any /* eslint-enable @typescript-eslint/no-explicit-any */ } type="wq" />,
    <ChessPieceIcon size={40} type={ /* eslint-disable @typescript-eslint/no-explicit-any */ 'invalid' as any /* eslint-enable @typescript-eslint/no-explicit-any */ } />,
    <ChessPieceIcon size={40} type={[ 'bb', /* eslint-disable @typescript-eslint/no-explicit-any */ 'zp' as any /* eslint-enable @typescript-eslint/no-explicit-any */ ]} />,
    <ChessPieceIcon size={40} type="wq" pieceset="not-a-pieceset" />,

]); /* eslint-enable react/jsx-key */
