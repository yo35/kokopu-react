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

import Chessboard from '../src/chessboard';

import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';


export const initialState2 = {
	position: new kokopu.Position(),
	positionAfter: null, // non-null only if a valid move has been played
	isFlipped: false,
	moveArrowVisible: true,
	editedMove: '',
	playedMove: '',
};


export class Page2 extends React.Component {

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
		return (<>
			<Box m={2}>
				<ButtonGroup color="primary" size="small">
					<Button onClick={() => this.handlePositionClicked(new kokopu.Position('empty'))}>Empty position</Button>
					<Button onClick={() => this.handlePositionClicked(new kokopu.Position())}>Start position</Button>
					<Button onClick={() => this.handlePositionClicked('8/8/8/8/8/4k3/q7/4K3 b - - 0 1')}>Custom position 1</Button>
					<Button onClick={() => this.handlePositionClicked('r3k3/1bn3nP/1P6/2n3n1/R4pP1/8/Q2P3R/8 w kq - 0 1')}>Custom position 2</Button>
				</ButtonGroup>
			</Box>
			<Box m={2}>
				<FormControlLabel
					control={<Switch checked={state.isFlipped} onChange={() => this.handleFlipClicked(!state.isFlipped)} color="primary" />}
					label="Flip"
				/>
				<FormControlLabel
					control={<Switch checked={state.moveArrowVisible} onChange={() => this.handleMoveArrowVisibleClicked(!state.moveArrowVisible)} color="primary" />}
					label="Show move arrow" disabled={!state.positionAfter}
				/>
			</Box>
			<Box m={2}>
				<Box display="flex" flexDirection="row">
					<TextField label="Move" helperText="Nf3 for instance" value={state.editedMove} onChange={evt => this.handleMoveChanged(evt.target.value)} />
					<Box m={2}>
						<Button color="primary" variant="contained" onClick={() => this.handlePlayClicked()}>Play</Button>
					</Box>
				</Box>
			</Box>
			<Box m={2}>
				{this.getMoveDescription()}
			</Box>
		</>);
	}

	renderChessboard() {
		let state = this.props.state;
		return (
			<div>
				<Chessboard
					position={state.position}
					move={state.playedMove}
					isFlipped={state.isFlipped}
					squareSize={56}
					moveArrowVisible={state.moveArrowVisible}
				/>
			</div>
		);
	}

	handlePositionClicked(newPosition) {
		let newState = {...this.props.state};
		newState.position = newPosition;
		newState.positionAfter = null;
		newState.playedMove = '';
		this.props.setState(newState);
	}

	handleFlipClicked(newIsFlipped) {
		let newState = {...this.props.state};
		newState.isFlipped = newIsFlipped;
		this.props.setState(newState);
	}

	handleMoveArrowVisibleClicked(newMoveArrowVisible) {
		let newState = {...this.props.state};
		newState.moveArrowVisible = newMoveArrowVisible;
		this.props.setState(newState);
	}

	handleMoveChanged(newMove) {
		let newState = {...this.props.state};
		newState.editedMove = newMove;
		this.props.setState(newState);
	}

	handlePlayClicked() {
		let newState = {...this.props.state};
		let currentPosition = new kokopu.Position(newState.positionAfter ? newState.positionAfter : newState.position);
		let move = newState.editedMove.trim();
		if (move === '') {
			newState.playedMove = '';
			newState.position = currentPosition;
			newState.positionAfter = null;
		}
		else {
			try {
				let moveDescriptor = currentPosition.notation(move);
				newState.playedMove = currentPosition.notation(moveDescriptor);
				newState.position = currentPosition;
				newState.positionAfter = new kokopu.Position(currentPosition);
				newState.positionAfter.play(moveDescriptor);
			}
			catch (e) {
				if (e instanceof kokopu.exception.InvalidNotation) {
					newState.playedMove = move;
					newState.position = currentPosition;
					newState.positionAfter = null;
				}
				else {
					throw e;
				}
			}
		}
		newState.editedMove = '';
		this.props.setState(newState);
	}

	getMoveDescription() {
		let state = this.props.state;
		if (state.positionAfter) {
			return <Alert severity="success">{'Displayed move: ' + state.playedMove}</Alert>;
		}
		else if (state.playedMove === '') {
			return <Alert severity="info">No move is displayed.</Alert>;
		}
		else {
			return <Alert severity="warning">{`An invalid move has been defined (${state.playedMove}).`}</Alert>;
		}
	}
}
