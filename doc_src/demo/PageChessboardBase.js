/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2022  Yoann Le Montagner <yo35 -at- melix.net>       *
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

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

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
			<Stack spacing={2} mt={2}>
				{this.renderControls()}
				{this.renderChessboard()}
				{this.renderCode()}
			</Stack>
		);
	}

	renderControls() {
		return (<>
			<Stack direction="row" spacing={2} alignItems="center">
				<FormControlLabel label="Flip"
					control={<Switch checked={this.state.flipped} onChange={() => this.set('flipped', !this.state.flipped)} color="primary" />}
				/>
				<FormControlLabel label="Show coordinates"
					control={<Switch checked={this.state.coordinateVisible} onChange={() => this.set('coordinateVisible', !this.state.coordinateVisible)} color="primary" />}
				/>
				<FormControlLabel label="Show annotations"
					control={<Switch checked={this.state.annotationVisible} onChange={() => this.set('annotationVisible', !this.state.annotationVisible)} color="primary" />}
				/>
			</Stack>
			<Box>
				<Typography gutterBottom>Square size</Typography>
				<Slider
					value={this.state.squareSize} onChange={(_, newValue) => this.set('squareSize', newValue)}
					min={Chessboard.minSquareSize()} max={Chessboard.maxSquareSize()} step={1} valueLabelDisplay="on" color="primary"
				/>
			</Box>
			<Stack direction="row" spacing={2} alignItems="center">
				<FormControl variant="standard">
					<InputLabel id="colorset-label">Colorset</InputLabel>
					<Select labelId="colorset-label" sx={{ width: '8em' }} value={this.state.colorset} onChange={evt => this.set('colorset', evt.target.value)}>
						{Object.keys(Chessboard.colorsets()).sort().map(colorset => <MenuItem key={colorset} value={colorset}>{colorset}</MenuItem>)}
					</Select>
				</FormControl>
				<FormControl variant="standard">
					<InputLabel id="pieceset-label">Pieceset</InputLabel>
					<Select labelId="pieceset-label" sx={{ width: '8em' }} value={this.state.pieceset} onChange={evt => this.set('pieceset', evt.target.value)}>
						{Object.keys(Chessboard.piecesets()).sort().map(pieceset => <MenuItem key={pieceset} value={pieceset}>{pieceset}</MenuItem>)}
					</Select>
				</FormControl>
				<ButtonGroup color="primary" size="small">
					<Button onClick={() => this.set('position', 'empty')}>Clear</Button>
					<Button onClick={() => this.set('position', 'start')}>Reset</Button>
					<Button onClick={() => this.set('position', '8/8/8/8/8/4k3/q7/4K3 b - - 0 1')}>Set FEN</Button>
					<Button onClick={() => this.set('position', 'I\'m an invalid FEN string')}>Set ill-formed FEN</Button>
				</ButtonGroup>
			</Stack>
		</>);
	}

	renderChessboard() {
		return (
			<Box>
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
		return <pre className="kokopu-demoCode">{buildComponentDemoCode('Chessboard', attributes)}</pre>;
	}

	set(attributeName, newValue) {
		let newState = {};
		newState[attributeName] = newValue;
		this.setState(newState);
	}
}
