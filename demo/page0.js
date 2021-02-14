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

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

export const initialState0 = {
	position: new kokopu.Position(),
	isFlipped: false,
	squareSize: 40,
	coordinateVisible: true,
};

export class Page0 extends React.Component {

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
			<div>
				<ButtonGroup color="primary">
					<Button onClick={() => this.handlePositionClicked(new kokopu.Position('empty'))}>Empty position</Button>
					<Button onClick={() => this.handlePositionClicked(new kokopu.Position())}>Start position</Button>
					<Button onClick={() => this.handlePositionClicked('8/8/8/8/8/4k3/q7/4K3 b - - 0 1')}>Custom position</Button>
					<Button onClick={() => this.handlePositionClicked('8/k1b/8/8/8/4k3/q7/4K3 b - - 0 1')}>Bad FEN</Button>
				</ButtonGroup>
			</div>
			<div>
				<FormControlLabel
					control={<Switch checked={state.isFlipped} onChange={() => this.handleFlipClicked(!state.isFlipped)} color="primary" />}
					label="Flip"
				/>
				<FormControlLabel
					control={<Switch checked={state.coordinateVisible} onChange={() => this.handleCoordinateVisibleClicked(!state.coordinateVisible)} color="primary" />}
					label="Show coordinates"
				/>
			</div>
			<div>
				<Typography gutterBottom>
					Square size
				</Typography>
				<Slider
					value={state.squareSize}  onChange={(_, newValue) => this.handleSquareSizeChanged(newValue)}
					min={12} max={64} step={1} valueLabelDisplay="on" color="primary"
				/>
			</div>
		</>);
	}

	renderChessboard() {
		let state = this.props.state;
		return (
			<div>
				<Chessboard
					position={state.position}
					isFlipped={state.isFlipped}
					squareSize={state.squareSize}
					coordinateVisible={state.coordinateVisible}
				/>
			</div>
		);
	}

	handlePositionClicked(newPosition) {
		let newState = {...this.props.state};
		newState.position = newPosition;
		this.props.setState(newState);
	}

	handleFlipClicked(newIsFlipped) {
		let newState = {...this.props.state};
		newState.isFlipped = newIsFlipped;
		this.props.setState(newState);
	}

	handleSquareSizeChanged(newSquareSize) {
		let newState = {...this.props.state};
		newState.squareSize = newSquareSize;
		this.props.setState(newState);
	}

	handleCoordinateVisibleClicked(newCoordinateVisible) {
		let newState = {...this.props.state};
		newState.coordinateVisible = newCoordinateVisible;
		this.props.setState(newState);
	}
}
