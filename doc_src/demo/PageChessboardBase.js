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
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import './demo.css';


const SQUARE_MARKERS = 'Gc4,Gc5,Re4,Re5,Yg4,Yg5';
const ARROW_MARKERS = 'Gd3b6,Rf3d6,Yh3f6';


export default class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			position: 'start',
			flipped: false,
			squareSize: 40,
			coordinateVisible: true,
			annotationVisible: false,
			colorset: 'original',
			pieceset: 'cburnett',
		};
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
		return (<>
			<Box my={2}>
				<FormControlLabel label="Flip"
					control={<Switch checked={this.state.flipped} onChange={() => this.set('flipped', !this.state.flipped)} color="primary" />}
				/>
				<FormControlLabel label="Show coordinates"
					control={<Switch checked={this.state.coordinateVisible} onChange={() => this.set('coordinateVisible', !this.state.coordinateVisible)} color="primary" />}
				/>
				<FormControlLabel label="Show annotations"
					control={<Switch checked={this.state.annotationVisible} onChange={() => this.set('annotationVisible', !this.state.annotationVisible)} color="primary" />}
				/>
			</Box>
			<Box my={2}>
				<Typography gutterBottom>Square size</Typography>
				<Slider
					value={this.state.squareSize} onChange={(_, newValue) => this.set('squareSize', newValue)}
					min={Chessboard.minSquareSize()} max={Chessboard.maxSquareSize()} step={1} valueLabelDisplay="on" color="primary"
				/>
			</Box>
			<Box my={2} display="flex" flexDirection="row" alignItems="center">
				<Box mr={2}>
					<Typography>Colorset</Typography>
					<Select value={this.state.colorset} onChange={evt => this.set('colorset', evt.target.value)}>
						{Object.keys(Chessboard.colorsets()).sort().map(colorset => <MenuItem key={colorset} value={colorset}>{colorset}</MenuItem>)}
					</Select>
				</Box>
				<Box mx={2}>
					<Typography>Pieceset</Typography>
					<Select value={this.state.pieceset} onChange={evt => this.set('pieceset', evt.target.value)}>
						{Object.keys(Chessboard.piecesets()).sort().map(pieceset => <MenuItem key={pieceset} value={pieceset}>{pieceset}</MenuItem>)}
					</Select>
				</Box>
				<Box ml={2}>
					<ButtonGroup color="primary" size="small">
						<Button onClick={() => this.set('position', 'empty')}>Clear</Button>
						<Button onClick={() => this.set('position', 'start')}>Reset</Button>
						<Button onClick={() => this.set('position', '8/8/8/8/8/4k3/q7/4K3 b - - 0 1')}>Set FEN</Button>
						<Button onClick={() => this.set('position', 'I\'m an invalid FEN string')}>Set ill-formed FEN</Button>
					</ButtonGroup>
				</Box>
			</Box>
		</>);
	}

	renderChessboard() {
		return (
			<Box my={2}>
				<Chessboard
					position={this.state.position}
					flipped={this.state.flipped}
					squareSize={this.state.squareSize}
					coordinateVisible={this.state.coordinateVisible}
					squareMarkers={this.state.annotationVisible ? SQUARE_MARKERS : ''}
					arrowMarkers={this.state.annotationVisible ? ARROW_MARKERS : ''}
					colorset={this.state.colorset}
					pieceset={this.state.pieceset}
				/>
			</Box>
		);
	}

	renderCode() {
		let attributes = [];
		if (this.state.position !== 'start') {
			attributes.push(`position="${this.state.position}"`);
		}
		if (this.state.flipped) {
			attributes.push('flipped');
		}
		if (this.state.annotationVisible) {
			attributes.push(`squareMarkers="${SQUARE_MARKERS}"`);
			attributes.push(`arrowMarkers="${ARROW_MARKERS}"`);
		}
		attributes.push(`squareSize={${this.state.squareSize}}`);
		attributes.push(`coordinateVisible={${this.state.coordinateVisible}}`);
		attributes.push(`colorset="${this.state.colorset}"`);
		attributes.push(`pieceset="${this.state.pieceset}"`);
		return (
			<Box my={2}>
				<pre className="kokopu-demoCode">
					{buildComponentDemoCode('Chessboard', attributes)}
				</pre>
			</Box>
		);
	}

	set(attributeName, newValue) {
		let newState = {};
		newState[attributeName] = newValue;
		this.setState(newState);
	}
}
