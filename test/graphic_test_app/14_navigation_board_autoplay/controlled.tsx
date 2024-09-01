/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2024  Yoann Le Montagner <yo35 -at- melix.net>       *
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
import { setSandbox, testApp } from '../common/test_app';
import { NavigationBoard } from '../../../dist/lib/index';

import pgn from '../common/games.pgn';

const HISTORY_0: string[] = [];
const HISTORY_1: string[] = [];
const HISTORY_2: string[] = [];

interface NavigationBoardWithNodeIdControllerProps {
    initialNodeId: string,
    sandboxHistory: string[],
}

function NavigationBoardWithNodeIdController({ initialNodeId, sandboxHistory }: NavigationBoardWithNodeIdControllerProps) {

    const [ nodeId, setNodeId ] = React.useState(initialNodeId);

    return (
        <NavigationBoard
            game={pgn} playButtonVisible nodeId={nodeId}
            onNodeIdChanged={newNodeId => {
                sandboxHistory.push(`Node ID changed: ${newNodeId}`);
                setSandbox(sandboxHistory.join('\n'));
                setNodeId(newNodeId);
            }}
        />
    );
}

function NavigationBoardWithIsPlayingController() {

    const [ isPlaying, setIsPlaying ] = React.useState(false);

    return (
        <NavigationBoard
            game={pgn} playButtonVisible initialNodeId="5b" isPlaying={isPlaying}
            onIsPlayingChanged={newIsPlaying => {
                setSandbox(`is-playing flag changed: ${newIsPlaying}`);
                setIsPlaying(newIsPlaying);
            }}
        />
    );
}

testApp([ /* eslint-disable react/jsx-key */
    <NavigationBoard
        game={pgn} playButtonVisible nodeId="3w"
        onNodeIdChanged={nodeId => {
            HISTORY_0.push(`Node ID changed: ${nodeId}`);
            setSandbox(HISTORY_0.join('\n'));
        }}
    />,
    <NavigationBoardWithNodeIdController initialNodeId="3w" sandboxHistory={HISTORY_1} />,
    <NavigationBoardWithNodeIdController initialNodeId="20w" sandboxHistory={HISTORY_2} />,
    <NavigationBoard
        game={pgn} playButtonVisible initialNodeId="5b" isPlaying={false}
        onIsPlayingChanged={isPlaying => {
            setSandbox(`is-playing flag changed: ${isPlaying}`);
        }}
    />,
    <NavigationBoardWithIsPlayingController />,
    <NavigationBoard game={pgn} playButtonVisible initialNodeId="20b" isPlaying={true} />,
]); /* eslint-enable react/jsx-key */
