/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2023  Yoann Le Montagner <yo35 -at- melix.net>       *
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
import { pgnRead } from 'kokopu';

import { Chessboard, Movetext } from '../../src/index';
import { buildComponentDemoCode } from './util';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import './demo.css';
import game1 from './game-1.pgn';
import game2 from './game-2.pgn';


export default class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pgn: game1,
			selection: '28b',
			interactionMode: 'selectMove',
			withPopup: true,
			withMove: false,
		};
	}

	render() {
		return (
			<Stack spacing={2} mt={2}>
				{this.renderControls()}
				{this.renderMovetext()}
				{this.renderCode()}
				{this.renderNavigationBoard()}
			</Stack>
		);
	}

	renderControls() {
		return (<>
			<Stack direction="row" spacing={2} alignItems="center">
				<ButtonGroup color="primary" size="small">
					<Button onClick={() => this.set('pgn', game1, 'selection', '28b')}>Game 1</Button>
					<Button onClick={() => this.set('pgn', game2, 'selection', '15b')}>Game 2</Button>
				</ButtonGroup>
			</Stack>
			<Box>
				<Typography gutterBottom>Interaction mode</Typography>
				<RadioGroup value={this.state.interactionMode} onChange={evt => this.set('interactionMode', evt.target.value)}>
					<FormControlLabel value="" control={<Radio color="primary" />} label="None" />
					<FormControlLabel value="selectMove" control={<Radio color="primary" />} label="Select moves" />
				</RadioGroup>
			</Box>
		</>);
	}

	renderMovetext() {
		return (
			<Box>
				<Movetext
					game={this.state.pgn}
					selection={this.state.selection}
					pieceSymbols="figurines"
					diagramVisible={false}
					interactionMode={this.state.interactionMode}
					onMoveSelected={(nodeId, evtOrigin) => this.handleMoveSelected(nodeId, evtOrigin)}
				/>
			</Box>
		);
	}

	renderCode() {
		let attributes = [];
		attributes.push('game={pgn}');
		attributes.push('pieceSymbols="figurines"');
		attributes.push('diagramVisible={false}');
		attributes.push(`selection="${this.state.selection}"`);
		switch(this.state.interactionMode) {
			case 'selectMove':
				attributes.push('interactionMode="selectMove"');
				attributes.push('onMoveSelected={nodeId => handleMoveSelected(nodeId)}');
				break;
			default:
				break;
		}
		let pgnDeclaration = 'const pgn = `\n' + this.state.pgn.trim() + '`;\n\n';
		return <pre className="kokopu-demoCode">{pgnDeclaration + buildComponentDemoCode('Movetext', attributes)}</pre>;
	}

	renderNavigationBoard() {
		let button = <Button size="small" onClick={() => this.handlePopupToggled()}>{this.state.withPopup ? 'Reduce' : 'Open'}</Button>;
		let { position, move, csl, cal } = this.getCurrentPositionAndAnnotations();
		let content = this.state.withPopup ? <Stack><Chessboard position={position} move={move} squareMarkers={csl} arrowMarkers={cal} animated={true} />{button}</Stack> : button;
		return <Paper className="kokopu-fixedPopup" elevation={3}>{content}</Paper>;
	}

	handleMoveSelected(nodeId, evtOrigin) {
		if (nodeId) {
			this.set('selection', nodeId, 'withMove', evtOrigin === 'key-next');
		}
	}

	handlePopupToggled() {
		this.set('withPopup', !this.state.withPopup);
	}

	set(attributeName, newValue, attributeName2, newValue2) {
		let newState = {};
		newState[attributeName] = newValue;
		if (attributeName2) {
			newState[attributeName2] = newValue2;
		}
		this.setState(newState);
	}

	getCurrentPositionAndAnnotations() {
		let game = pgnRead(this.state.pgn, 0);
		if (this.state.selection === 'start') {
			let mainVariation = game.mainVariation();
			return { position: mainVariation.initialPosition(), csl: mainVariation.tag('csl'), cal: mainVariation.tag('cal') };
		}
		else {
			let node = game.findById(this.state.selection);
			let result = this.state.withMove ? { position: node.positionBefore(), move: node.notation() } : { position: node.position() };
			result.csl = node.tag('csl');
			result.cal = node.tag('cal');
			return result;
		}
	}
}
