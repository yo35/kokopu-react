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

import { Chessboard, Movetext } from '../../src/index';
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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import './demo.css';
import game1 from './game-1.pgn';
import game2 from './game-2.pgn';
import invalidGame from './game-invalid.pgn';


export default class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pgn: game1,
			headerVisible: true,
			diagramVisible: true,
			pieceSymbols: 'figurines',
			customSymbols: { K:'R', Q:'D', R:'T', B:'F', N:'C', P:'P' },
			diagramOptions: {
				flipped: false,
				squareSize: 32,
				coordinateVisible: true,
				colorset: 'original',
				pieceset: 'cburnett',
			},
		};
	}

	render() {
		return (
			<Stack spacing={2} mt={2}>
				{this.renderControls()}
				{this.renderMovetext()}
				{this.renderCode()}
			</Stack>
		);
	}

	renderControls() {
		let opts = this.state.diagramOptions;
		return (<>
			<Stack direction="row" spacing={2} alignItems="center">
				<ButtonGroup color="primary" size="small">
					<Button onClick={() => this.set('pgn', game1)}>Game 1</Button>
					<Button onClick={() => this.set('pgn', game2)}>Game 2</Button>
					<Button onClick={() => this.set('pgn', invalidGame)}>Invalid game</Button>
				</ButtonGroup>
				<FormControlLabel label="Show headers"
					control={<Switch checked={this.state.headerVisible} onChange={() => this.set('headerVisible', !this.state.headerVisible)} color="primary" />}
				/>
				<FormControlLabel label="Show diagrams"
					control={<Switch checked={this.state.diagramVisible} onChange={() => this.set('diagramVisible', !this.state.diagramVisible)} color="primary" />}
				/>
			</Stack>
			<Stack direction="row" spacing={2} alignItems="center">
				<FormControl variant="standard">
					<InputLabel id="piecesymbols-label">Piece symbols</InputLabel>
					<Select labelId="piecesymbols-label" sx={{ width: '8em' }} value={this.state.pieceSymbols} onChange={evt => this.set('pieceSymbols', evt.target.value)}>
						<MenuItem value="native">Native</MenuItem>
						<MenuItem value="figurines">Figurines</MenuItem>
						<MenuItem value="custom">Custom</MenuItem>
					</Select>
				</FormControl>
				{this.renderCustomSymbolSelector()}
			</Stack>
			<Stack direction="row" spacing={2} alignItems="center">
				<FormControlLabel label="Flip diagram(s)"
					control={<Switch checked={opts.flipped} onChange={() => this.setDiagramOption('flipped', !opts.flipped)} color="primary" />}
				/>
				<FormControlLabel label="Show coordinates in diagram(s)"
					control={<Switch checked={opts.coordinateVisible} onChange={() => this.setDiagramOption('coordinateVisible', !opts.coordinateVisible)} color="primary" />}
				/>
				<FormControl variant="standard">
					<InputLabel id="colorset-label">Colorset</InputLabel>
					<Select labelId="colorset-label" sx={{ width: '8em' }} value={opts.colorset} onChange={evt => this.setDiagramOption('colorset', evt.target.value)}>
						{Object.keys(Chessboard.colorsets()).sort().map(colorset => <MenuItem key={colorset} value={colorset}>{colorset}</MenuItem>)}
					</Select>
				</FormControl>
				<FormControl variant="standard">
					<InputLabel id="pieceset-label">Pieceset</InputLabel>
					<Select labelId="pieceset-label" sx={{ width: '8em' }} value={opts.pieceset} onChange={evt => this.setDiagramOption('pieceset', evt.target.value)}>
						{Object.keys(Chessboard.piecesets()).sort().map(pieceset => <MenuItem key={pieceset} value={pieceset}>{pieceset}</MenuItem>)}
					</Select>
				</FormControl>
			</Stack>
			<Box>
				<Typography gutterBottom>Diagram square size</Typography>
				<Slider
					value={opts.squareSize} onChange={(_, newValue) => this.setDiagramOption('squareSize', newValue)}
					min={Chessboard.minSquareSize()} max={Chessboard.maxSquareSize()} step={1} valueLabelDisplay="on" color="primary"
				/>
			</Box>
		</>);
	}

	renderCustomSymbolSelector() {
		if (this.state.pieceSymbols !== 'custom') {
			return undefined;
		}
		let symbols = this.state.customSymbols;
		return (<>
			<TextField variant="standard" sx={{ width: '3em' }} label="King" value={symbols.K} onChange={evt => this.setCustomSymbol('K', evt.target.value)} />
			<TextField variant="standard" sx={{ width: '3em' }} label="Queen" value={symbols.Q} onChange={evt => this.setCustomSymbol('Q', evt.target.value)} />
			<TextField variant="standard" sx={{ width: '3em' }} label="Rook" value={symbols.R} onChange={evt => this.setCustomSymbol('R', evt.target.value)} />
			<TextField variant="standard" sx={{ width: '3em' }} label="Bishop" value={symbols.B} onChange={evt => this.setCustomSymbol('B', evt.target.value)} />
			<TextField variant="standard" sx={{ width: '3em' }} label="Knight" value={symbols.N} onChange={evt => this.setCustomSymbol('N', evt.target.value)} />
			<TextField variant="standard" sx={{ width: '3em' }} label="Pawn" value={symbols.P} onChange={evt => this.setCustomSymbol('P', evt.target.value)} />
		</>);
	}

	renderMovetext() {
		return (
			<Box>
				<Movetext
					game={this.state.pgn}
					headerVisible={this.state.headerVisible}
					diagramVisible={this.state.diagramVisible}
					pieceSymbols={this.state.pieceSymbols === 'custom' ? this.state.customSymbols : this.state.pieceSymbols}
					diagramOptions={this.state.diagramOptions}
				/>
			</Box>
		);
	}

	renderCode() {
		let attributes = [];
		attributes.push('game={pgn}');
		attributes.push(`headerVisible={${this.state.headerVisible}}`);
		attributes.push(`pieceSymbols=${this.getPieceSymbolsAsText()}`);
		attributes.push(`diagramVisible={${this.state.diagramVisible}}`);
		attributes.push(`diagramOptions={{ ${this.getDiagramAttributesAsText()} }}`);
		let pgnDeclaration = 'const pgn = `\n' + this.state.pgn.trim() + '`;\n\n';
		return <pre className="kokopu-demoCode">{pgnDeclaration + buildComponentDemoCode('Movetext', attributes)}</pre>;
	}

	set(attributeName, newValue) {
		let newState = {};
		newState[attributeName] = newValue;
		this.setState(newState);
	}

	setCustomSymbol(key, value) {
		let symbols = {...this.state.customSymbols};
		symbols[key] = value;
		this.set('customSymbols', symbols);
	}

	getPieceSymbolsAsText() {
		if (this.state.pieceSymbols === 'custom') {
			let symbols = this.state.customSymbols;
			return `{{ K:'${symbols.K}', Q:'${symbols.Q}', R:'${symbols.R}', B:'${symbols.B}', N:'${symbols.N}', P:'${symbols.P}' }}`;
		}
		else {
			return `"${this.state.pieceSymbols}"`;
		}
	}

	setDiagramOption(key, value) {
		let diagramOptions = {...this.state.diagramOptions};
		diagramOptions[key] = value;
		this.set('diagramOptions', diagramOptions);
	}

	getDiagramAttributesAsText() {
		let attributes = [];
		if (this.state.diagramOptions.flipped) {
			attributes.push('flipped:true');
		}
		attributes.push(`squareSize:${this.state.diagramOptions.squareSize}`);
		attributes.push(`coordinateVisible:${this.state.diagramOptions.coordinateVisible}`);
		attributes.push(`colorset:'${this.state.diagramOptions.colorset}'`);
		attributes.push(`pieceset:'${this.state.diagramOptions.pieceset}'`);
		return attributes.join(', ');
	}
}
