/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021  Yoann Le Montagner <yo35 -at- melix.net>            *
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

import { Chessboard } from '../../src/index';
import { buildComponentDemoCode } from './util';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import './demo.css';


export default class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			squareSize: 56,
			windowWidth: window.innerWidth,
			limits: [
				{ width: 170, squareSize: 12, coordinateVisible: false },
				{ width: 250, squareSize: 16, coordinateVisible: false },
				{ width: 340, squareSize: 24, coordinateVisible: false },
				{ width: 450, squareSize: 32 },
				{ width: 560, squareSize: 44 },
				{ width: 600, squareSize: 52, coordinateVisible: true },
				{ width: 640, squareSize: 24, coordinateVisible: false },
				{ width: 750, squareSize: 32 },
				{ width: 860, squareSize: 44 },
			],
		};
		this.windowResizeListener = () => this.handleWindowResize();
	}

	componentDidMount() {
		window.addEventListener('resize', this.windowResizeListener);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.windowResizeListener);
	}

	render() {
		return (
			<div>
				{this.renderControls()}
				{this.renderChessboard()}
				{this.renderCode()}
			</div>
		);
	}

	renderControls() {
		return (
			<Box my={2}>
				<Typography>Resize the browser to see the chessboard adapt its size...</Typography>
				<Typography>{`Current browser width: ${this.state.windowWidth} px`}</Typography>
			</Box>
		);
	}

	renderChessboard() {
		return (
			<Box my={2}>
				<Chessboard squareSize={this.state.squareSize} smallScreenLimits={this.state.limits} />
			</Box>
		);
	}

	renderCode() {

		let limits = this.state.limits.map(limit => {
			let limitAttributes = [`width: ${limit.width}`, `squareSize: ${limit.squareSize}`];
			if ('coordinateVisible' in limit) {
				limitAttributes.push(`coordinateVisible: ${limit.coordinateVisible}`);
			}
			return `    { ${limitAttributes.join(', ')} },\n`;
		});

		let attributes = [];
		attributes.push(`squareSize={${this.state.squareSize}}`);
		attributes.push('smallScreenLimits={limits}');
		return (
			<Box my={2}>
				<pre className="kokopu-demoCode">
					{
						'let limits = [\n' +
						limits.join('') +
						'];\n' +
						buildComponentDemoCode('Chessboard', attributes)
					}
				</pre>
			</Box>
		);
	}

	handleWindowResize() {
		this.setState({ windowWidth: window.innerWidth });
	}
}
