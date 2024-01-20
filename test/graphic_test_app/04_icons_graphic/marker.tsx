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
import { SquareMarkerIcon, TextMarkerIcon, ArrowMarkerIcon } from '../../../dist/lib/index';

testApp([ /* eslint-disable react/jsx-key */

	<SquareMarkerIcon size={40} />,
	<SquareMarkerIcon size={45} color="green" />,
	<div style={{ color: 'purple' }}><SquareMarkerIcon size={31} /></div>,
	<SquareMarkerIcon size={ /* eslint-disable @typescript-eslint/no-explicit-any */ 'not-a-number' as any /* eslint-enable @typescript-eslint/no-explicit-any */ } />,

	<TextMarkerIcon size={41} symbol="A" />,
	<TextMarkerIcon size={29} symbol="b" color="#0ff" />,
	<div style={{ color: 'red' }}><TextMarkerIcon size={53} symbol="5" /></div>,
	<TextMarkerIcon size={47} symbol="dot" color="#00f" />,
	<div style={{ color: 'pink' }}><TextMarkerIcon size={48} symbol="circle" /></div>,
	<TextMarkerIcon size={ /* eslint-disable @typescript-eslint/no-explicit-any */ 'not-a-number' as any /* eslint-enable @typescript-eslint/no-explicit-any */ } symbol="A" />,
	<TextMarkerIcon size={40} symbol={ /* eslint-disable @typescript-eslint/no-explicit-any */ 'not-a-symbol' as any /* eslint-enable @typescript-eslint/no-explicit-any */ } />,

	<ArrowMarkerIcon size={40} />,
	<ArrowMarkerIcon size={24} color="#888" />,
	<div style={{ color: '#f70' }}><ArrowMarkerIcon size={48} /></div>,
	<ArrowMarkerIcon size={ /* eslint-disable @typescript-eslint/no-explicit-any */ 'not-a-number' as any /* eslint-enable @typescript-eslint/no-explicit-any */ } />,

]); /* eslint-enable react/jsx-key */
