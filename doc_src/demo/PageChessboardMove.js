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

import { Chessboard } from '../../src/index';
import { buildComponentDemoCode } from './util';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

import './demo.css';


export default class Page extends React.Component {

	constructor(props) {
		super(props);
		let position = new kokopu.Position();
		let positionAfter = new kokopu.Position(position);
		positionAfter.play('e4');
		this.state = {
			position: position,
			positionAfter: positionAfter, // non-null only if a valid move has been played
			flipped: false,
			moveArrowVisible: true,
			animated: true,
			editedMove: 'Nf6',
			playedMove: 'e4',
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
				<FormControlLabel label="Show move arrow" disabled={!this.state.positionAfter}
					control={<Switch checked={this.state.moveArrowVisible} onChange={() => this.set('moveArrowVisible', !this.state.moveArrowVisible)} color="primary" />}
				/>
				<FormControlLabel label="Animation" disabled={!this.state.positionAfter}
					control={<Switch checked={this.state.animated} onChange={() => this.set('animated', !this.state.animated)} color="primary" />}
				/>
			</Stack>
			<Stack direction="row" spacing={2} alignItems="center">
				<TextField label="Move" variant="standard" value={this.state.editedMove} onChange={evt => this.set('editedMove', evt.target.value)} />
				<Button color="primary" size="small" variant="contained" onClick={() => this.handlePlayClicked()}>Play</Button>
				<ButtonGroup color="primary" size="small">
					<Button onClick={() => this.setPosition(new kokopu.Position('empty'))}>Clear</Button>
					<Button onClick={() => this.setPosition(new kokopu.Position())}>Reset</Button>
				</ButtonGroup>
			</Stack>
		</>);
	}

	renderChessboard() {
		return (
			<Box>
				<Chessboard
					position={this.state.position}
					move={this.state.playedMove}
					flipped={this.state.flipped}
					moveArrowVisible={this.state.moveArrowVisible}
					animated={this.state.animated}
				/>
			</Box>
		);
	}

	renderCode() {
		let attributes = [];
		attributes.push(`position="${this.state.position.fen()}"`);
		if (this.state.playedMove !== '') {
			attributes.push(`move="${this.state.playedMove}"`);
		}
		if (this.state.flipped) {
			attributes.push('flipped');
		}
		attributes.push(`moveArrowVisible={${this.state.moveArrowVisible}}`);
		attributes.push(`animated={${this.state.animated}}`);
		return <pre className="kokopu-demoCode">{buildComponentDemoCode('Chessboard', attributes)}</pre>;
	}

	set(attributeName, newValue) {
		let newState = {};
		newState[attributeName] = newValue;
		this.setState(newState);
	}

	setPosition(newPosition) {
		let newState = {};
		newState.position = newPosition;
		newState.playedMove = '';
		newState.positionAfter = null;
		this.setState(newState);
	}

	handlePlayClicked() {
		let newState = {};
		let currentPosition = new kokopu.Position(this.state.positionAfter ? this.state.positionAfter : this.state.position);
		let move = this.state.editedMove.trim();
		if (move === '') {
			newState.position = currentPosition;
			newState.playedMove = '';
			newState.positionAfter = null;
		}
		else {
			try {
				let moveDescriptor = currentPosition.notation(move);
				newState.position = currentPosition;
				newState.playedMove = currentPosition.notation(moveDescriptor);
				newState.positionAfter = new kokopu.Position(currentPosition);
				newState.positionAfter.play(moveDescriptor);
			}
			catch (e) {
				if (e instanceof kokopu.exception.InvalidNotation) {
					newState.position = currentPosition;
					newState.playedMove = move;
					newState.positionAfter = null;
				}
				else {
					throw e;
				}
			}
		}
		this.setState(newState);
	}
}
