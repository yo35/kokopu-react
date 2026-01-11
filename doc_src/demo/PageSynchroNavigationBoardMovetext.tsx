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
import { pgnRead, Game } from 'kokopu';

import { Movetext, NavigationBoard } from '../../src/index';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import './demo.css';
import game1 from './game-1.pgn';
import game2 from './game-2.pgn';
import NavigationBoardWithMoveTextSourceCode from './NavigationBoardWithMoveText.txt';


interface PageState {
    componentKey: string,
    pgn: string,
}


function NavigationBoardWithMoveText({ game }: { game: Game }) {
    const [ nodeId, setNodeId ] = React.useState('start');
    return (
        <Stack direction="row" spacing={2}>
            <NavigationBoard animated sound game={game} nodeId={nodeId} onNodeIdChanged={setNodeId} />
            <Movetext
                game={game} diagramOptions={{ squareSize: 28 }} interactionMode="selectMove" selection={nodeId}
                onMoveSelected={n => {
                    if (n !== undefined) {
                        setNodeId(n);
                    }
                }}
            />
        </Stack>
    );
}


export default class Page extends React.Component<object, PageState> {

    constructor(props: object) {
        super(props);
        this.state = {
            componentKey: 'game1',
            pgn: game1,
        };
    }

    render() {
        return (
            <Stack spacing={2} mt={2}>
                {this.renderControls()}
                {this.renderNavigationBoardWithMovetext()}
                {this.renderCode()}
            </Stack>
        );
    }

    private renderControls() {
        return (
            <Stack direction="row" spacing={2} alignItems="center">
                <ButtonGroup color="primary" size="small">
                    <Button onClick={() => this.setState({ componentKey: 'game1', pgn: game1 })}>Game 1</Button>
                    <Button onClick={() => this.setState({ componentKey: 'game2', pgn: game2 })}>Game 2</Button>
                </ButtonGroup>
            </Stack>
        );
    }

    private renderNavigationBoardWithMovetext() {
        const game = pgnRead(this.state.pgn, 0);
        return <NavigationBoardWithMoveText key={this.state.componentKey} game={game} />;
    }

    private renderCode() {
        return (
            <>
                <Typography>
                    This example shows how to synchronize a <code>NavigationBoard</code> component with a <code>Movetext</code> component.
                    Both components are layout next to each other here, but real-world applications may use more complex layouts,
                    e.g. render them in distant places.
                    The key point to synchronize the components is to have them controlled by the same <code>nodeId</code> state variable.
                </Typography>
                <pre className="kokopu-demoCode">{NavigationBoardWithMoveTextSourceCode}</pre>
            </>
        );
    }

}
