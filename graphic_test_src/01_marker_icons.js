/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2023  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    This program is free software: you can redistribute it and/or           *
 *    modify it under the terms of the GNU Lesser General Public License      *
 *    as published by the Free Software Foundation, either version 3 of       *
 *    the License, or (at your option) any later version.                     *
 *                                                                            *
 *    This program is distributed in the hope that it will be useful,         *
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of          *
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the            *
 *    GNU Lesser General Public License for more details.                     *
 *                                                                            *
 *    You should have received a copy of the GNU Lesser General               *
 *    Public License along with this program. If not, see                     *
 *    <http://www.gnu.org/licenses/>.                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import testApp from './common/test_app';
import { SquareMarkerIcon, TextMarkerIcon, ArrowMarkerIcon } from '../src/index';

testApp([ /* eslint-disable react/jsx-key */
	<SquareMarkerIcon size={40} />,
	<SquareMarkerIcon size={45} color="green" />,
	<div style={{ color: 'purple' }}><SquareMarkerIcon size={31} /></div>,
	<TextMarkerIcon size={41} symbol="A" />,
	<TextMarkerIcon size={29} symbol="b" color="#0ff" />,
	<div style={{ color: 'red' }}><TextMarkerIcon size={53} symbol="5" /></div>,
	<ArrowMarkerIcon size={40} />,
	<ArrowMarkerIcon size={24} color="#888" />,
	<div style={{ color: '#f70' }}><ArrowMarkerIcon size={48} /></div>,
	<TextMarkerIcon size={47} symbol="dot" color="#00f" />,
	<div style={{ color: 'pink' }}><TextMarkerIcon size={48} symbol="circle" /></div>,
]); /* eslint-enable react/jsx-key */
