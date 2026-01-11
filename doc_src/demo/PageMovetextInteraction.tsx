/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2026  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    Kokopu-React is free software: you can redistribute it and/or           *
 *    modify it under the terms of the GNU Lesser General Public License      *
 *    as published by the Free Software Foundation, either version 3 of       *
 *    the License, or (at your option) any later version.                     *
 *                                                                            *
 *    Kokopu-React is distributed in the hope that it will be useful,         *
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
import { pgnRead, Node as GameNode } from 'kokopu';

import { Chessboard, Movetext, MovetextProps } from '../../src/index';
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


interface PageState {
    pgn: string,
    selection: string,
    interactionMode: 'none' | 'selectMove',
    withPopup: boolean,
}


export default class Page extends React.Component<object, PageState> {

    constructor(props: object) {
        super(props);
        this.state = {
            pgn: game1,
            selection: '28b',
            interactionMode: 'selectMove',
            withPopup: true,
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

    private renderControls() {
        return (
            <>
                <Stack direction="row" spacing={2} alignItems="center">
                    <ButtonGroup color="primary" size="small">
                        <Button onClick={() => this.setState({ pgn: game1, selection: '28b' })}>Game 1</Button>
                        <Button onClick={() => this.setState({ pgn: game2, selection: '15b' })}>Game 2</Button>
                    </ButtonGroup>
                </Stack>
                <Box>
                    <Typography gutterBottom>Interaction mode</Typography>
                    <RadioGroup value={this.state.interactionMode} onChange={evt => this.setState({ interactionMode: evt.target.value as PageState['interactionMode'] })}>
                        <FormControlLabel value="none" control={<Radio color="primary" />} label="None" />
                        <FormControlLabel value="selectMove" control={<Radio color="primary" />} label="Select moves" />
                    </RadioGroup>
                </Box>
            </>
        );
    }

    private renderMovetext() {
        return (
            <Box>
                <Movetext
                    game={this.state.pgn}
                    selection={this.state.selection}
                    pieceSymbols="figurines"
                    diagramVisible={false}
                    interactionMode={this.getMovetextInterationMode()}
                    onMoveSelected={nodeId => this.handleMoveSelected(nodeId)}
                />
            </Box>
        );
    }

    private renderCode() {
        const attributes: string[] = [];
        attributes.push('game={pgn}');
        attributes.push('pieceSymbols="figurines"');
        attributes.push('diagramVisible={false}');
        attributes.push(`selection="${this.state.selection}"`);
        switch (this.state.interactionMode) {
            case 'selectMove':
                attributes.push('interactionMode="selectMove"');
                attributes.push('onMoveSelected={nodeId => handleMoveSelected(nodeId)}');
                break;
            default:
                break;
        }
        const pgnDeclaration = 'const pgn = `\n' + this.state.pgn.trim() + '`;\n\n';
        return <pre className="kokopu-demoCode">{pgnDeclaration + buildComponentDemoCode('Movetext', attributes)}</pre>;
    }

    private renderNavigationBoard() {
        const button = <Button size="small" onClick={() => this.setState({ withPopup: !this.state.withPopup })}>{this.state.withPopup ? 'Reduce' : 'Open'}</Button>;
        const { position, move, csl, cal } = this.getCurrentPositionAndAnnotations();
        const content = this.state.withPopup ?
            <Stack><Chessboard position={position} move={move} squareMarkers={csl} arrowMarkers={cal} animated sound />{button}</Stack> :
            button;
        return <Paper className="kokopu-fixedPopup" elevation={3}>{content}</Paper>;
    }

    private handleMoveSelected(nodeId: string | undefined) {
        if (nodeId) {
            this.setState({ selection: nodeId });
        }
    }

    private getMovetextInterationMode(): MovetextProps['interactionMode'] {
        switch (this.state.interactionMode) {
            case 'selectMove':
                return this.state.interactionMode;
            default:
                return undefined;
        }
    }

    private getCurrentPositionAndAnnotations() {
        const game = pgnRead(this.state.pgn, 0);
        if (this.state.selection === 'start') {
            const mainVariation = game.mainVariation();
            return {
                position: mainVariation.initialPosition(),
                move: undefined,
                csl: mainVariation.tag('csl'),
                cal: mainVariation.tag('cal'),
            };
        }
        else {
            const node = game.findById(this.state.selection) as GameNode;
            return {
                position: node.positionBefore(),
                move: node.notation(),
                csl: node.tag('csl'),
                cal: node.tag('cal'),
            };
        }
    }

}
