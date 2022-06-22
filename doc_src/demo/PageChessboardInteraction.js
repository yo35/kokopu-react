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
import kokopu from 'kokopu';

import { Chessboard, SquareMarkerIcon, TextMarkerIcon, ArrowMarkerIcon, flattenSquareMarkers, flattenTextMarkers, flattenArrowMarkers } from '../../src/index';
import { buildComponentDemoCode } from './util';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import './demo.css';


const PIECE_ICON_SIZE = 24;
const COLOR_ICON_SIZE = 16;
const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';


export default class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			position: new kokopu.Position(),
			flipped: false,
			interactionMode: 'movePieces',
			pieceEditMode: 'wp',
			squareMarkerColor: 'g',
			textMarkerColor: 'g',
			textMarkerSymbol: 'A',
			arrowMarkerColor: 'g',
			squareMarkers: {},
			textMarkers: {},
			arrowMarkers: {},
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
				<Button color="primary" size="small" variant="contained" onClick={() => this.handleTurnClicked(kokopu.oppositeColor(this.state.position.turn()))}>
					Change turn
				</Button>
				<ButtonGroup color="primary" size="small">
					<Button onClick={() => this.set('position', new kokopu.Position('empty'))}>Clear</Button>
					<Button onClick={() => this.set('position', new kokopu.Position())}>Reset</Button>
				</ButtonGroup>
			</Stack>
			<Box>
				<Typography gutterBottom>Interaction mode</Typography>
				<RadioGroup value={this.state.interactionMode} onChange={evt => this.set('interactionMode', evt.target.value)}>
					<FormControlLabel value="" control={<Radio color="primary" />} label="None" />
					<Stack direction="row" spacing={2} alignItems="center">
						<FormControlLabel value="addRemovePieces" control={<Radio color="primary" />} label="Add/remove pieces" />
						{this.renderPieceSelector()}
					</Stack>
					<FormControlLabel value="movePieces" control={<Radio color="primary" />} label="Move pieces" />
					<FormControlLabel value="playMoves" control={<Radio color="primary" />} label="Move pieces (obeying chess rules)" />
					<Stack direction="row" spacing={2} alignItems="center">
						<FormControlLabel value="editSquareMarkers" control={<Radio color="primary" />} label="Edit square annotations" />
						{this.renderMarkerColorSelector('squareMarkerColor', 'editSquareMarkers')}
					</Stack>
					<Stack direction="row" spacing={2} alignItems="center">
						<FormControlLabel value="editTextMarkers" control={<Radio color="primary" />} label="Edit text annotations" />
						{this.renderMarkerColorSelector('textMarkerColor', 'editTextMarkers')}
						{this.renderTextMarkerSymbolSelector()}
					</Stack>
					<Stack direction="row" spacing={2} alignItems="center">
						<FormControlLabel value="editArrowMarkers" control={<Radio color="primary" />} label="Edit arrow annotations" />
						{this.renderMarkerColorSelector('arrowMarkerColor', 'editArrowMarkers')}
					</Stack>
				</RadioGroup>
			</Box>
		</>);
	}

	renderPieceSelector() {
		if (this.state.interactionMode !== 'addRemovePieces') {
			return undefined;
		}
		let pieceset = Chessboard.piecesets()['cburnett'];
		return (
			<Stack spacing={0.5}>
				<ToggleButtonGroup value={this.state.pieceEditMode} exclusive size="small" onChange={(_, newMode) => this.setIfNonNull('pieceEditMode', newMode)}>
					<ToggleButton value="wk"><img src={pieceset.wk} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
					<ToggleButton value="wq"><img src={pieceset.wq} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
					<ToggleButton value="wr"><img src={pieceset.wr} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
					<ToggleButton value="wb"><img src={pieceset.wb} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
					<ToggleButton value="wn"><img src={pieceset.wn} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
					<ToggleButton value="wp"><img src={pieceset.wp} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
				</ToggleButtonGroup>
				<ToggleButtonGroup value={this.state.pieceEditMode} exclusive size="small" onChange={(_, newMode) => this.setIfNonNull('pieceEditMode', newMode)}>
					<ToggleButton value="bk"><img src={pieceset.bk} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
					<ToggleButton value="bq"><img src={pieceset.bq} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
					<ToggleButton value="br"><img src={pieceset.br} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
					<ToggleButton value="bb"><img src={pieceset.bb} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
					<ToggleButton value="bn"><img src={pieceset.bn} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
					<ToggleButton value="bp"><img src={pieceset.bp} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
				</ToggleButtonGroup>
			</Stack>
		);
	}

	renderTextMarkerSymbolSelector() {
		if (this.state.interactionMode !== 'editTextMarkers') {
			return undefined;
		}
		let availableSymbols = [ 'plus', 'times', 'dot', 'circle' ].concat([...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789']);
		return (
			<Select variant="standard" value={this.state.textMarkerSymbol} onChange={evt => this.set('textMarkerSymbol', evt.target.value)}>
				{availableSymbols.map(mode => <MenuItem key={mode} value={mode}>{mode}</MenuItem>)}
			</Select>
		);
	}

	renderMarkerColorSelector(attributeName, expectedInterationMode) {
		if (this.state.interactionMode !== expectedInterationMode) {
			return undefined;
		}
		let colorset = Chessboard.colorsets()['original'];
		return (
			<ToggleButtonGroup value={this.state[attributeName]} exclusive size="small" onChange={(_, newColor) => this.setIfNonNull(attributeName, newColor)}>
				<ToggleButton className="kokopu-fixTextTransform" value="b">{this.renderColorButtonLabel(colorset.marker.b)}</ToggleButton>
				<ToggleButton className="kokopu-fixTextTransform" value="g">{this.renderColorButtonLabel(colorset.marker.g)}</ToggleButton>
				<ToggleButton className="kokopu-fixTextTransform" value="r">{this.renderColorButtonLabel(colorset.marker.r)}</ToggleButton>
				<ToggleButton className="kokopu-fixTextTransform" value="y">{this.renderColorButtonLabel(colorset.marker.y)}</ToggleButton>
			</ToggleButtonGroup>
		);
	}

	renderColorButtonLabel(color) {
		switch(this.state.interactionMode) {
			case 'editSquareMarkers':
				return <SquareMarkerIcon size={COLOR_ICON_SIZE} color={color} />;
			case 'editTextMarkers':
				return <TextMarkerIcon size={COLOR_ICON_SIZE} symbol={this.state.textMarkerSymbol} color={color} />;
			case 'editArrowMarkers':
				return <ArrowMarkerIcon size={COLOR_ICON_SIZE} color={color} />;
			default:
				return undefined;
		}
	}

	renderChessboard() {
		return (
			<Box>
				<Chessboard
					position={this.state.position}
					flipped={this.state.flipped}
					squareMarkers={this.state.squareMarkers}
					textMarkers={this.state.textMarkers}
					arrowMarkers={this.state.arrowMarkers}
					interactionMode={this.getChessboardInterationMode()}
					editedArrowColor={this.state.arrowMarkerColor}
					onPieceMoved={(from, to) => this.handlePieceMoved(from, to)}
					onMovePlayed={move => this.handleMovePlayed(move)}
					onArrowEdited={(from, to) => this.handleArrowEdited(from, to)}
					onSquareClicked={sq => this.handleSquareClicked(sq)}
				/>
			</Box>
		);
	}

	renderCode() {
		let attributes = [];
		let fen = this.state.position.fen();
		if (fen !== DEFAULT_FEN) {
			attributes.push(`position="${fen}"`);
		}
		if (this.state.flipped) {
			attributes.push('flipped');
		}
		let squareMarkers = flattenSquareMarkers(this.state.squareMarkers);
		let textMarkers = flattenTextMarkers(this.state.textMarkers);
		let arrowMarkers = flattenArrowMarkers(this.state.arrowMarkers);
		if (squareMarkers !== '') {
			attributes.push(`squareMarkers="${squareMarkers}"`);
		}
		if (textMarkers !== '') {
			attributes.push(`textMarkers="${textMarkers}"`);
		}
		if (arrowMarkers !== '') {
			attributes.push(`arrowMarkers="${arrowMarkers}"`);
		}
		switch(this.state.interactionMode) {
			case 'addRemovePieces':
			case 'editSquareMarkers':
			case 'editTextMarkers':
				attributes.push('interactionMode="clickSquares"');
				attributes.push('onSquareClicked={sq => handleSquareClicked(sq)}');
				break;
			case 'editArrowMarkers':
				attributes.push('interactionMode="editArrows"');
				attributes.push(`editedArrowColor="${this.state.arrowMarkerColor}"`);
				attributes.push('onArrowEdited={(from, to) => handleArrowEdited(from, to)}');
				break;
			case 'movePieces':
				attributes.push('interactionMode="movePieces"');
				attributes.push('onPieceMoved={(from, to) => handlePieceMoved(from, to)}');
				break;
			case 'playMoves':
				attributes.push('interactionMode="playMoves"');
				attributes.push('onMovePlayed={move => handleMovePlayed(move)}');
				break;
			default:
				break;
		}
		return <pre className="kokopu-demoCode">{buildComponentDemoCode('Chessboard', attributes)}</pre>;
	}

	set(attributeName, newValue) {
		let newState = {};
		newState[attributeName] = newValue;
		this.setState(newState);
	}

	setIfNonNull(attributeName, newValue) {
		if (newValue !== null) {
			this.set(attributeName, newValue);
		}
	}

	handleTurnClicked(newTurn) {
		let newPosition = new kokopu.Position(this.state.position);
		newPosition.turn(newTurn);
		this.set('position', newPosition);
	}

	handlePieceMoved(from, to) {
		let newPosition = new kokopu.Position(this.state.position);
		newPosition.square(to, newPosition.square(from));
		newPosition.square(from, '-');
		this.set('position', newPosition);
	}

	handleMovePlayed(move) {
		let newPosition = new kokopu.Position(this.state.position);
		newPosition.play(move);
		this.set('position', newPosition);
	}

	handleArrowEdited(from, to) {
		let newArrowMarkers = {...this.state.arrowMarkers};
		let key = from + to;
		if (newArrowMarkers[key] === this.state.arrowMarkerColor) {
			delete newArrowMarkers[key];
		}
		else {
			newArrowMarkers[key] = this.state.arrowMarkerColor;
		}
		this.set('arrowMarkers', newArrowMarkers);
	}

	handleSquareClicked(sq) {
		if (this.state.interactionMode === 'editSquareMarkers') {
			let newSquareMarkers = {...this.state.squareMarkers};
			if (newSquareMarkers[sq] === this.state.squareMarkerColor) {
				delete newSquareMarkers[sq];
			}
			else {
				newSquareMarkers[sq] = this.state.squareMarkerColor;
			}
			this.set('squareMarkers', newSquareMarkers);
		}
		else if (this.state.interactionMode === 'editTextMarkers') {
			let newTextMarkers = {...this.state.textMarkers};
			if (newTextMarkers[sq] && newTextMarkers[sq].color === this.state.textMarkerColor && newTextMarkers[sq].symbol === this.state.textMarkerSymbol) {
				delete newTextMarkers[sq];
			}
			else {
				newTextMarkers[sq] = { color: this.state.textMarkerColor, symbol: this.state.textMarkerSymbol };
			}
			this.set('textMarkers', newTextMarkers);
		}
		else if (this.state.interactionMode === 'addRemovePieces') {
			let newPosition = new kokopu.Position(this.state.position);
			newPosition.square(sq, newPosition.square(sq) === this.state.pieceEditMode ? '-' : this.state.pieceEditMode);
			this.set('position', newPosition);
		}
	}

	getChessboardInterationMode() {
		switch(this.state.interactionMode) {
			case 'addRemovePieces':
			case 'editSquareMarkers':
			case 'editTextMarkers':
				return 'clickSquares';
			case 'editArrowMarkers':
				return 'editArrows';
			case 'movePieces':
			case 'playMoves':
				return this.state.interactionMode;
			default:
				return undefined;
		}
	}
}
