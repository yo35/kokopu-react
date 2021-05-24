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
import kokopu from 'kokopu';

import { Chessboard, SquareMarkerIcon, TextMarkerIcon, colorsets, piecesets } from '../src/index';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';

export const initialState1 = {
	position: new kokopu.Position(),
	flipped: false,
	interactionMode: 'movePieces',
	textMarkerMode: 'A',
	pieceEditMode: 'wp',
	annotationColor: 'g',
	squareMarkers: {},
	textMarkers: {},
	arrowMarkers: {},
};


export class Page1 extends React.Component {

	render() {
		return (
			<Grid container>
				<Grid item xs={5}>
					{this.renderControls()}
				</Grid>
				<Grid item xs={7}>
					{this.renderChessboard()}
				</Grid>
			</Grid>
		);
	}

	renderControls() {
		let state = this.props.state;
		return (<>
			<Box m={2}>
				<ButtonGroup color="primary" size="small">
					<Button onClick={() => this.handlePositionChanged(new kokopu.Position('empty'))}>Empty position</Button>
					<Button onClick={() => this.handlePositionChanged(new kokopu.Position())}>Start position</Button>
					<Button onClick={() => this.handlePositionChanged('8/8/8/8/8/4k3/q7/4K3 b - - 0 1')}>Custom position 1</Button>
					<Button onClick={() => this.handlePositionChanged('r3k3/1bn3nP/1P6/2n3n1/R4pP1/8/Q2P3R/8 w kq - 0 1')}>Custom position 2</Button>
				</ButtonGroup>
			</Box>
			<Box m={2}>
				<FormControlLabel
					control={<Switch checked={state.flipped} onChange={() => this.handleFlipClicked(!state.flipped)} color="primary" />}
					label="Flip"
				/>
				<Button color="primary" size="small" variant="contained" onClick={() => this.handleTurnClicked(state.position.turn() === 'w' ? 'b' : 'w')}>
					Change turn
				</Button>
			</Box>
			<Box m={2}>
				<Typography gutterBottom>
					Edition mode
				</Typography>
				<RadioGroup value={state.interactionMode} onChange={evt => this.handleInteractionModeChanged(evt.target.value)}>
					<FormControlLabel value="" control={<Radio color="primary" />} label="None" />
					<Box display="flex" flexDirection="row">
						<FormControlLabel value="addRemovePieces" control={<Radio color="primary" />} label="Add/remove pieces" />
						{this.renderPieceSelector()}
					</Box>
					<FormControlLabel value="movePieces" control={<Radio color="primary" />} label="Move pieces" />
					<FormControlLabel value="editSquareMarkers" control={<Radio color="primary" />} label="Edit square annotations" />
					<Box display="flex" flexDirection="row">
						<FormControlLabel value="editTextMarkers" control={<Radio color="primary" />} label="Edit text annotations" />
						{this.renderSymbolSelector()}
					</Box>
					<FormControlLabel value="editArrows" control={<Radio color="primary" />} label="Edit arrow annotations" />
				</RadioGroup>
			</Box>
			{this.renderAnnotationColorSelector()}
		</>);
	}

	renderPieceSelector() {
		let interactionMode = this.props.state.interactionMode;
		if (interactionMode !== 'addRemovePieces') {
			return undefined;
		}
		let pieceset = piecesets['cburnett'];
		let pieceEditMode = this.props.state.pieceEditMode;
		return (
			<Box>
				<Box m={0.5}>
					<ToggleButtonGroup value={pieceEditMode} exclusive size="small" onChange={(_, newMode) => this.handlePieceEditModeChanged(newMode)}>
						<ToggleButton value="wk"><img src={pieceset.wk} width={24} height={24} /></ToggleButton>
						<ToggleButton value="wq"><img src={pieceset.wq} width={24} height={24} /></ToggleButton>
						<ToggleButton value="wr"><img src={pieceset.wr} width={24} height={24} /></ToggleButton>
						<ToggleButton value="wb"><img src={pieceset.wb} width={24} height={24} /></ToggleButton>
						<ToggleButton value="wn"><img src={pieceset.wn} width={24} height={24} /></ToggleButton>
						<ToggleButton value="wp"><img src={pieceset.wp} width={24} height={24} /></ToggleButton>
					</ToggleButtonGroup>
				</Box>
				<Box m={0.5}>
					<ToggleButtonGroup value={pieceEditMode} exclusive size="small" onChange={(_, newMode) => this.handlePieceEditModeChanged(newMode)}>
						<ToggleButton value="bk"><img src={pieceset.bk} width={24} height={24} /></ToggleButton>
						<ToggleButton value="bq"><img src={pieceset.bq} width={24} height={24} /></ToggleButton>
						<ToggleButton value="br"><img src={pieceset.br} width={24} height={24} /></ToggleButton>
						<ToggleButton value="bb"><img src={pieceset.bb} width={24} height={24} /></ToggleButton>
						<ToggleButton value="bn"><img src={pieceset.bn} width={24} height={24} /></ToggleButton>
						<ToggleButton value="bp"><img src={pieceset.bp} width={24} height={24} /></ToggleButton>
					</ToggleButtonGroup>
				</Box>
			</Box>
		);
	}

	renderSymbolSelector() {
		let interactionMode = this.props.state.interactionMode;
		if (interactionMode !== 'editTextMarkers') {
			return undefined;
		}
		let textMarkerMode = this.props.state.textMarkerMode;
		return (
			<Select value={textMarkerMode} onChange={evt => this.handleTextMarkerModeChanged(evt.target.value)}>
				{[...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'].map(mode => <MenuItem key={mode} value={mode}>{mode}</MenuItem>)}
			</Select>
		);
	}

	renderAnnotationColorSelector() {
		let interactionMode = this.props.state.interactionMode;
		if (interactionMode !== 'editSquareMarkers' && interactionMode !== 'editTextMarkers' && interactionMode !== 'editArrows') {
			return undefined;
		}
		let colorset = colorsets['original'];
		let annotationColor = this.props.state.annotationColor;
		return (
			<Box m={2}>
				<Typography gutterBottom>
					Annotation color
				</Typography>
				<Box m={0.5}>
					<ToggleButtonGroup value={annotationColor} exclusive size="small" onChange={(_, newColor) => this.handleAnnotationColorChanged(newColor)}>
						<ToggleButton className="kokopu-fixTextTransform" value="g">{this.renderColorButtonLabel(colorset.g)}</ToggleButton>
						<ToggleButton className="kokopu-fixTextTransform" value="r">{this.renderColorButtonLabel(colorset.r)}</ToggleButton>
						<ToggleButton className="kokopu-fixTextTransform" value="y">{this.renderColorButtonLabel(colorset.y)}</ToggleButton>
					</ToggleButtonGroup>
				</Box>
			</Box>
		);
	}

	renderColorButtonLabel(color) {
		switch(this.props.state.interactionMode) {
			case 'editSquareMarkers':
			case 'editArrows': // TODO arrow icon
				return <SquareMarkerIcon size={24} color={color} />;
			case 'editTextMarkers':
				return <TextMarkerIcon size={24} symbol={this.props.state.textMarkerMode} color={color} />;
			default:
				return undefined;
		}
	}

	renderChessboard() {
		let state = this.props.state;
		let interactionMode = state.interactionMode === 'editSquareMarkers' || state.interactionMode === 'editTextMarkers' ||
			state.interactionMode === 'addRemovePieces' ? 'clickSquares' : state.interactionMode;
		return (
			<div>
				<Chessboard
					position={state.position}
					flipped={state.flipped}
					squareSize={56}
					squareMarkers={state.squareMarkers}
					textMarkers={state.textMarkers}
					arrowMarkers={state.arrowMarkers}
					interactionMode={interactionMode}
					editedArrowColor={state.annotationColor}
					onPieceMoved={(from, to) => this.handlePieceMoved(from, to)}
					onArrowEdited={(from, to) => this.handleArrowEdited(from, to)}
					onSquareClicked={sq => this.handleSquareClicked(sq)}
				/>
			</div>
		);
	}

	handlePositionChanged(newPosition) {
		let newState = {...this.props.state};
		newState.position = newPosition;
		this.props.setState(newState);
	}

	handleFlipClicked(newFlipped) {
		let newState = {...this.props.state};
		newState.flipped = newFlipped;
		this.props.setState(newState);
	}

	handleTurnClicked(newTurn) {
		let newPosition = new kokopu.Position(this.props.state.position);
		newPosition.turn(newTurn);
		this.handlePositionChanged(newPosition);
	}

	handleInteractionModeChanged(newInteractionMode) {
		let newState = {...this.props.state};
		newState.interactionMode = newInteractionMode;
		this.props.setState(newState);
	}

	handleTextMarkerModeChanged(newMode) {
		let newState = {...this.props.state};
		newState.textMarkerMode = newMode;
		this.props.setState(newState);
	}

	handlePieceEditModeChanged(newMode) {
		if (newMode === null) {
			return;
		}
		let newState = {...this.props.state};
		newState.pieceEditMode = newMode;
		this.props.setState(newState);
	}

	handleAnnotationColorChanged(newColor) {
		if (newColor === null) {
			return;
		}
		let newState = {...this.props.state};
		newState.annotationColor = newColor;
		this.props.setState(newState);
	}

	handlePieceMoved(from, to) {
		let newPosition = new kokopu.Position(this.props.state.position);
		newPosition.square(to, newPosition.square(from));
		newPosition.square(from, '-');
		this.handlePositionChanged(newPosition);
	}

	handleArrowEdited(from, to) {
		let newState = {...this.props.state};
		let key = from + to;
		newState.arrowMarkers[key] = newState.arrowMarkers[key] === newState.annotationColor ? '' : newState.annotationColor;
		this.props.setState(newState);
	}

	handleSquareClicked(sq) {
		if (this.props.state.interactionMode === 'editSquareMarkers') {
			let newState = {...this.props.state};
			newState.squareMarkers[sq] = newState.squareMarkers[sq] === newState.annotationColor ? '' : newState.annotationColor;
			this.props.setState(newState);
		}
		else if (this.props.state.interactionMode === 'editTextMarkers') {
			let newState = {...this.props.state};
			if (newState.textMarkers[sq] && newState.textMarkers[sq].color === newState.annotationColor && newState.textMarkers[sq].symbol === newState.textMarkerMode) {
				delete newState.textMarkers[sq];
			}
			else {
				newState.textMarkers[sq] = { color: newState.annotationColor, symbol: newState.textMarkerMode };
			}
			this.props.setState(newState);
		}
		else if (this.props.state.interactionMode === 'addRemovePieces') {
			let newPosition = new kokopu.Position(this.props.state.position);
			newPosition.square(sq, newPosition.square(sq) === this.props.state.pieceEditMode ? '-' : this.props.state.pieceEditMode);
			this.handlePositionChanged(newPosition);
		}
	}
}
