/******************************************************************************
 *                                                                            *
 *    This file is part of KokopuReact, a JavaScript chess library.           *
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

import colorsets from '../src/colorsets';
import piecesets from '../src/piecesets';
import Chessboard from '../src/chessboard';

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
	isFlipped: false,
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
		let colorset = colorsets['original'];
		let pieceset = piecesets['cburnett'];
		let disablePieceEditMode = state.interactionMode !== 'addRemovePieces';
		let disableTextMarkerMode = state.interactionMode !== 'editTextMarkers';
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
					control={<Switch checked={state.isFlipped} onChange={() => this.handleFlipClicked(!state.isFlipped)} color="primary" />}
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
						<Box>
							<Box m={0.5}>
								<ToggleButtonGroup value={state.pieceEditMode} exclusive size="small" onChange={(_, newMode) => this.handlePieceEditModeChanged(newMode)}>
									<ToggleButton value="wk" disabled={disablePieceEditMode}><img src={pieceset.wk} width={24} height={24} /></ToggleButton>
									<ToggleButton value="wq" disabled={disablePieceEditMode}><img src={pieceset.wq} width={24} height={24} /></ToggleButton>
									<ToggleButton value="wr" disabled={disablePieceEditMode}><img src={pieceset.wr} width={24} height={24} /></ToggleButton>
									<ToggleButton value="wb" disabled={disablePieceEditMode}><img src={pieceset.wb} width={24} height={24} /></ToggleButton>
									<ToggleButton value="wn" disabled={disablePieceEditMode}><img src={pieceset.wn} width={24} height={24} /></ToggleButton>
									<ToggleButton value="wp" disabled={disablePieceEditMode}><img src={pieceset.wp} width={24} height={24} /></ToggleButton>
								</ToggleButtonGroup>
							</Box>
							<Box m={0.5}>
								<ToggleButtonGroup value={state.pieceEditMode} exclusive size="small" onChange={(_, newMode) => this.handlePieceEditModeChanged(newMode)}>
									<ToggleButton value="bk" disabled={disablePieceEditMode}><img src={pieceset.bk} width={24} height={24} /></ToggleButton>
									<ToggleButton value="bq" disabled={disablePieceEditMode}><img src={pieceset.bq} width={24} height={24} /></ToggleButton>
									<ToggleButton value="br" disabled={disablePieceEditMode}><img src={pieceset.br} width={24} height={24} /></ToggleButton>
									<ToggleButton value="bb" disabled={disablePieceEditMode}><img src={pieceset.bb} width={24} height={24} /></ToggleButton>
									<ToggleButton value="bn" disabled={disablePieceEditMode}><img src={pieceset.bn} width={24} height={24} /></ToggleButton>
									<ToggleButton value="bp" disabled={disablePieceEditMode}><img src={pieceset.bp} width={24} height={24} /></ToggleButton>
								</ToggleButtonGroup>
							</Box>
						</Box>
					</Box>
					<FormControlLabel value="movePieces" control={<Radio color="primary" />} label="Move pieces" />
					<FormControlLabel value="editSquareMarkers" control={<Radio color="primary" />} label="Edit square annotations" />
					<Box display="flex" flexDirection="row">
						<FormControlLabel value="editTextMarkers" control={<Radio color="primary" />} label="Edit text annotations" />
						<Select value={state.textMarkerMode} disabled={disableTextMarkerMode} onChange={evt => this.handleTextMarkerModeChanged(evt.target.value)}>
							{[...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'].map(mode => <MenuItem key={mode} value={mode}>{mode}</MenuItem>)}
						</Select>
					</Box>
					<FormControlLabel value="editArrows" control={<Radio color="primary" />} label="Edit arrow annotations" />
				</RadioGroup>
			</Box>
			<Box m={2}>
				<Typography gutterBottom>
					Annotation color
				</Typography>
				<Box m={0.5}>
					<ToggleButtonGroup value={state.annotationColor} exclusive size="small" onChange={(_, newColor) => this.handleAnnotationColorChanged(newColor)}>
						<ToggleButton value="g">{colorButtonLabel(colorset, 'g')}</ToggleButton>
						<ToggleButton value="r">{colorButtonLabel(colorset, 'r')}</ToggleButton>
						<ToggleButton value="y">{colorButtonLabel(colorset, 'y')}</ToggleButton>
					</ToggleButtonGroup>
				</Box>
			</Box>
		</>);
	}

	renderChessboard() {
		let state = this.props.state;
		let interactionMode = state.interactionMode === 'editSquareMarkers' || state.interactionMode === 'editTextMarkers' ||
			state.interactionMode === 'addRemovePieces' ? 'clickSquares' : state.interactionMode;
		return (
			<div>
				<Chessboard
					position={state.position}
					isFlipped={state.isFlipped}
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

	handleFlipClicked(newIsFlipped) {
		let newState = {...this.props.state};
		newState.isFlipped = newIsFlipped;
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
		if (!(from in newState.arrowMarkers)) {
			newState.arrowMarkers[from] = {};
		}
		newState.arrowMarkers[from][to] = newState.arrowMarkers[from][to] === newState.annotationColor ? '' : newState.annotationColor;
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
			if (newState.textMarkers[sq] && newState.textMarkers[sq].color === newState.annotationColor && newState.textMarkers[sq].text === newState.textMarkerMode) {
				delete newState.textMarkers[sq];
			}
			else {
				newState.textMarkers[sq] = { color: newState.annotationColor, text: newState.textMarkerMode };
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

function colorButtonLabel(colorset, color) {
	return <svg width={24} height={24}><circle cx={12} cy={12} r={12} fill={colorset[color]} /></svg>;
}
