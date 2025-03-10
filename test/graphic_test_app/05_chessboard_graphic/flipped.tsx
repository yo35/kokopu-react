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
import { Position } from 'kokopu';
import { testApp } from '../common/test_app';
import { Chessboard } from '../../../dist/lib/index';

testApp([ /* eslint-disable react/jsx-key */
    <Chessboard flipped={true} turnVisible={false} />,
    <Chessboard flipped={true} position="empty" />,
    <Chessboard flipped={true} position="something invalid" />,
    <Chessboard flipped={true} position="r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3" />,
    <Chessboard flipped={true} position={new Position('8/8/1r6/8/5k1K/8/8/8 b - - 0 1')} turnVisible={true} />,
]); /* eslint-enable react/jsx-key */
