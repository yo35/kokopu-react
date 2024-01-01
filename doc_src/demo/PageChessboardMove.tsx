/* -------------------------------------------------------------------------- *
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2024  Yoann Le Montagner <yo35 -at- melix.net>       *
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
 * -------------------------------------------------------------------------- */


import * as React from 'react';
import { exception, Position } from 'kokopu';

import { Chessboard, ArrowMarkerIcon, AnnotationColor } from '../../src/index';
import { buildComponentDemoCode } from './util';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import './demo.css';

const COLOR_ICON_SIZE = 16;


interface PageState {
	position: Position;
	positionAfter: Position | null; // non-null only if a valid move has been played
	flipped: boolean;
	moveArrowVisible: boolean;
	moveArrowColor: AnnotationColor;
	animated: boolean;
	editedMove: string;
	playedMove: string;
}


export default class Page extends React.Component<object, PageState> {

	constructor(props: object) {
		super(props);
		const position = new Position();
		const positionAfter = new Position(position);
		positionAfter.play('e4');
		this.state = {
			position: position,
			positionAfter: positionAfter,
			flipped: false,
			moveArrowVisible: true,
			moveArrowColor: 'b',
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

	private renderControls() {
		return (<>
			<Stack direction="row" spacing={2} alignItems="center">
				<FormControlLabel label="Flip"
					control={<Switch checked={this.state.flipped} onChange={() => this.setState({ flipped: !this.state.flipped })} color="primary" />}
				/>
				<FormControlLabel label="Animation" disabled={!this.state.positionAfter}
					control={<Switch checked={this.state.animated} onChange={() => this.setState({ animated: !this.state.animated })} color="primary" />}
				/>
				<FormControlLabel label="Show move arrow" disabled={!this.state.positionAfter}
					control={<Switch checked={this.state.moveArrowVisible} onChange={() => this.setState({ moveArrowVisible: !this.state.moveArrowVisible })} color="primary" />}
				/>
				{this.renderColorSelector()}
			</Stack>
			<Stack direction="row" spacing={2} alignItems="center">
				<TextField label="Move" variant="standard" value={this.state.editedMove} onChange={evt => this.setState({ editedMove: evt.target.value })} />
				<Button color="primary" size="small" variant="contained" onClick={() => this.handlePlayClicked()}>Play</Button>
				<ButtonGroup color="primary" size="small">
					<Button onClick={() => this.handlePositionChanged(new Position('empty'))}>Clear</Button>
					<Button onClick={() => this.handlePositionChanged(new Position())}>Reset</Button>
				</ButtonGroup>
			</Stack>
		</>);
	}

	private renderColorSelector() {
		if (!this.state.moveArrowVisible) {
			return undefined;
		}
		const colorset = Chessboard.colorsets()['original'];
		return (
			<ToggleButtonGroup value={this.state.moveArrowColor} exclusive size="small" disabled={!this.state.positionAfter} onChange={(_, newColor) => this.handleMoveColorChanged(newColor)}>
				<ToggleButton className="kokopu-fixOpacity" value="b"><ArrowMarkerIcon size={COLOR_ICON_SIZE} color={colorset.cb} /></ToggleButton>
				<ToggleButton className="kokopu-fixOpacity" value="g"><ArrowMarkerIcon size={COLOR_ICON_SIZE} color={colorset.cg} /></ToggleButton>
				<ToggleButton className="kokopu-fixOpacity" value="r"><ArrowMarkerIcon size={COLOR_ICON_SIZE} color={colorset.cr} /></ToggleButton>
				<ToggleButton className="kokopu-fixOpacity" value="y"><ArrowMarkerIcon size={COLOR_ICON_SIZE} color={colorset.cy} /></ToggleButton>
			</ToggleButtonGroup>
		);
	}

	private renderChessboard() {
		return (
			<Box>
				<Chessboard
					position={this.state.position}
					move={this.state.playedMove === '' ? undefined : this.state.playedMove}
					flipped={this.state.flipped}
					moveArrowVisible={this.state.moveArrowVisible}
					moveArrowColor={this.state.moveArrowColor}
					animated={this.state.animated}
				/>
			</Box>
		);
	}

	private renderCode() {
		const attributes: string[] = [];
		attributes.push(`position="${this.state.position.fen()}"`);
		if (this.state.playedMove !== '') {
			attributes.push(`move="${this.state.playedMove}"`);
		}
		if (this.state.flipped) {
			attributes.push('flipped');
		}
		attributes.push(`animated={${this.state.animated}}`);
		attributes.push(`moveArrowVisible={${this.state.moveArrowVisible}}`);
		if (this.state.moveArrowVisible) {
			attributes.push(`moveArrowColor={${this.state.moveArrowColor}}`);
		}
		return <pre className="kokopu-demoCode">{buildComponentDemoCode('Chessboard', attributes)}</pre>;
	}

	private handleMoveColorChanged(newColor: AnnotationColor | null) {
		if (newColor !== null) {
			this.setState({ moveArrowColor: newColor });
		}
	}

	private handlePositionChanged(newPosition: Position) {
		this.setState({
			position: newPosition,
			playedMove: '',
			positionAfter: null,
		});
	}

	private handlePlayClicked() {
		const currentPosition = new Position(this.state.positionAfter ? this.state.positionAfter : this.state.position);
		const move = this.state.editedMove.trim();
		if (move === '') {
			this.setState({
				position: currentPosition,
				playedMove: '',
				positionAfter: null,
			});
		}
		else {
			try {
				const moveDescriptor = currentPosition.notation(move);
				const positionAfter = new Position(currentPosition);
				positionAfter.play(moveDescriptor);
				this.setState({
					position: currentPosition,
					playedMove: currentPosition.notation(moveDescriptor),
					positionAfter: positionAfter,
				});
			}
			catch (e) {
				if (e instanceof exception.InvalidNotation) {
					this.setState({
						position: currentPosition,
						playedMove: '',
						positionAfter: null,
					});
				}
				else {
					throw e;
				}
			}
		}
	}

}
