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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';


export const initialState1 = {
	position: new kokopu.Position(),
	isFlipped: false,
	interactionMode: 'movePieces',
	clickMode: 'wp',
	squareMarkers: {}
};


export class Page1 extends React.Component {

	render() {
		return (
			<Grid container spacing={10}>
				<Grid item xs={4}>
					{this.renderControls()}
				</Grid>
				<Grid item xs={8}>
					{this.renderChessboard()}
				</Grid>
			</Grid>
		);
	}

	renderControls() {
		let state = this.props.state;
		let colorset = colorsets['original'];
		let pieceset = piecesets['cburnett'];
		let disableClickMode = state.interactionMode !== 'clickSquares';
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
				<Button color="primary" size="small" variant="outlined" onClick={() => this.handleTurnClicked(state.position.turn() === 'w' ? 'b' : 'w')}>Change turn</Button>
			</Box>
			<Box m={2}>
				<Typography gutterBottom>
					Interaction mode
				</Typography>
				<RadioGroup value={state.interactionMode} onChange={event => this.handleInteractionModeChanged(event.target.value)}>
					<FormControlLabel value="none" control={<Radio color="primary" />} label="None" />
					<FormControlLabel value="movePieces" control={<Radio color="primary" />} label="Move pieces" />
					<FormControlLabel value="clickSquares" control={<Radio color="primary" />} label="Add/remove pieces or edit annotations" />
				</RadioGroup>
				<Box m={0.5}>
					<ToggleButtonGroup value={state.clickMode} exclusive size="small" onChange={(_, newClickMode) => this.handleClickModeChanged(newClickMode)}>
						<ToggleButton value="wk" disabled={disableClickMode}><img src={pieceset.wk} width={24} height={24} /></ToggleButton>
						<ToggleButton value="wq" disabled={disableClickMode}><img src={pieceset.wq} width={24} height={24} /></ToggleButton>
						<ToggleButton value="wr" disabled={disableClickMode}><img src={pieceset.wr} width={24} height={24} /></ToggleButton>
						<ToggleButton value="wb" disabled={disableClickMode}><img src={pieceset.wb} width={24} height={24} /></ToggleButton>
						<ToggleButton value="wn" disabled={disableClickMode}><img src={pieceset.wn} width={24} height={24} /></ToggleButton>
						<ToggleButton value="wp" disabled={disableClickMode}><img src={pieceset.wp} width={24} height={24} /></ToggleButton>
					</ToggleButtonGroup>
				</Box>
				<Box m={0.5}>
					<ToggleButtonGroup value={state.clickMode} exclusive size="small" onChange={(_, newClickMode) => this.handleClickModeChanged(newClickMode)}>
						<ToggleButton value="bk" disabled={disableClickMode}><img src={pieceset.bk} width={24} height={24} /></ToggleButton>
						<ToggleButton value="bq" disabled={disableClickMode}><img src={pieceset.bq} width={24} height={24} /></ToggleButton>
						<ToggleButton value="br" disabled={disableClickMode}><img src={pieceset.br} width={24} height={24} /></ToggleButton>
						<ToggleButton value="bb" disabled={disableClickMode}><img src={pieceset.bb} width={24} height={24} /></ToggleButton>
						<ToggleButton value="bn" disabled={disableClickMode}><img src={pieceset.bn} width={24} height={24} /></ToggleButton>
						<ToggleButton value="bp" disabled={disableClickMode}><img src={pieceset.bp} width={24} height={24} /></ToggleButton>
					</ToggleButtonGroup>
				</Box>
				<Box m={0.5}>
					<ToggleButtonGroup value={state.clickMode} exclusive size="small" onChange={(_, newClickMode) => this.handleClickModeChanged(newClickMode)}>
						<ToggleButton value="sqm-g" disabled={disableClickMode}>{squareMarkerButtonLabel(colorset, 'g')}</ToggleButton>
						<ToggleButton value="sqm-r" disabled={disableClickMode}>{squareMarkerButtonLabel(colorset, 'r')}</ToggleButton>
						<ToggleButton value="sqm-y" disabled={disableClickMode}>{squareMarkerButtonLabel(colorset, 'y')}</ToggleButton>
					</ToggleButtonGroup>
				</Box>
			</Box>
		</>);
	}

	renderChessboard() {
		let state = this.props.state;
		return (
			<div>
				<Chessboard
					position={state.position}
					isFlipped={state.isFlipped}
					squareSize={56}
					squareMarkers={state.squareMarkers}
					interactionMode={state.interactionMode}
					onPieceMoved={(from, to) => this.handlePieceMoved(from, to)}
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

	handleClickModeChanged(newClickMode) {
		if (newClickMode === null) {
			return;
		}
		let newState = {...this.props.state};
		newState.clickMode = newClickMode;
		this.props.setState(newState);
	}

	handlePieceMoved(from, to) {
		let newPosition = new kokopu.Position(this.props.state.position);
		newPosition.square(to, newPosition.square(from));
		newPosition.square(from, '-');
		this.handlePositionChanged(newPosition);
	}

	handleSquareClicked(sq) {
		if (this.props.state.clickMode.startsWith('sqm-')) {
			let color = this.props.state.clickMode.substring(4);
			let newState = {...this.props.state};
			newState.squareMarkers[sq] = newState.squareMarkers[sq] === color ? '' : color;
			this.props.setState(newState);
		}
		else {
			let newPosition = new kokopu.Position(this.props.state.position);
			newPosition.square(sq, newPosition.square(sq) === this.props.state.clickMode ? '-' : this.props.state.clickMode);
			this.handlePositionChanged(newPosition);
		}
	}
}

function squareMarkerButtonLabel(colorset, color) {
	return (
		<svg width={24} height={24}>
			<circle cx={12} cy={12} r={12} fill={colorset[color]} />
		</svg>
	);
}
