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
import { testApp, setSandbox } from '../common/test_app';
import { Movetext } from '../../../dist/lib/index';

import pgn from '../common/games.pgn';

function onMoveSelected(nodeId: string | undefined, evtOrigin: string) {
    setSandbox(`move selected: ${nodeId}\norigin: ${evtOrigin}`);
}

testApp([ /* eslint-disable react/jsx-key */
    <Movetext game={pgn} gameIndex={7} headerVisible={false} onMoveSelected={onMoveSelected} selection="4w" />,
    <Movetext game={pgn} gameIndex={7} headerVisible={false} onMoveSelected={onMoveSelected} interactionMode="selectMove" />,
    <Movetext game={pgn} gameIndex={7} headerVisible={false} interactionMode="selectMove" />,
    <Movetext game={pgn} gameIndex={8} headerVisible={false} onMoveSelected={onMoveSelected} interactionMode="selectMove" selection="1b-v0-3w-v0-3w" />,
    <Movetext game={pgn} gameIndex={8} headerVisible={false} onMoveSelected={onMoveSelected} interactionMode="selectMove" selection="1b-v0-2b" />,
    <Movetext game={pgn} gameIndex={7} headerVisible={false} onMoveSelected={onMoveSelected} interactionMode="selectMove" selection="start" />,
    <Movetext game={pgn} gameIndex={7} headerVisible={false} onMoveSelected={onMoveSelected} interactionMode="selectMove" selection="1w" />,
    <Movetext game={pgn} gameIndex={7} headerVisible={false} onMoveSelected={onMoveSelected} interactionMode="selectMove" selection="6b" />,
    <Movetext game={pgn} gameIndex={7} headerVisible={false} onMoveSelected={onMoveSelected} interactionMode="selectMove" selection="invalid-id" />,
    <Movetext game={pgn} gameIndex={8} headerVisible={false} onMoveSelected={onMoveSelected} interactionMode="selectMove" selection="1b-v0-start" />,
], 'width-600'); /* eslint-enable react/jsx-key */
