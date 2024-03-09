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

import { Database, Game } from 'kokopu';

import { IllegalArgument } from '../exception';
import { sanitizeString, sanitizeBoolean, sanitizeOptional } from '../sanitization';
import { PieceSymbolMapping } from '../types';

import { StaticBoardGraphicProps } from '../chessboard/BoardProperties';
import { parseGame } from '../errorbox/parsing';
import { firstNodeId as firstNodeIdImpl, previousNodeId as previousNodeIdImpl, nextNodeId as nextNodeIdImpl, lastNodeId as lastNodeIdImpl } from '../navigationboard/NavigationField';
import { moveFormatter } from './moveFormatter';
import { MovetextImpl } from './MovetextImpl';

import './Movetext.css';


/**
 * Origin of a "move-selected" event in {@link Movetext}. See {@link MovetextProps.onMoveSelected} for more details.
 */
export type MoveSelectEventOrigin = 'key-first' | 'key-previous' | 'key-next' | 'key-last' | 'key-exit' | 'click';


export interface MovetextProps {

    /**
     * Displayed game. Can be a [kokopu.Game](https://kokopu.yo35.org/docs/current/classes/Game.html) object,
     * a [kokopu.Database](https://kokopu.yo35.org/docs/current/classes/Database.html) object,
     * or a [PGN string](https://en.wikipedia.org/wiki/Portable_Game_Notation).
     */
    game: Game | Database | string;

    /**
     * Index of the game to display (only if attribute `game` is a [kokopu.Database](https://kokopu.yo35.org/docs/current/classes/Database.html)
     * or a [PGN string](https://en.wikipedia.org/wiki/Portable_Game_Notation)): `0` for the first game of the database/PGN, `1` for the second one, etc.
     * If omitted, the first game of the database/PGN is displayed.
     */
    gameIndex: number;

    /**
     * Options applicable to the diagrams in the comments. See [Chessboard](#/Components/Chessboard) for more details about each option.
     */
    diagramOptions: Partial<StaticBoardGraphicProps> & {
        flipped?: boolean,
    };

    /**
     * Symbols to use for the chess pieces. See {@link moveFormatter}.
     */
    pieceSymbols: 'native' | 'localized' | 'figurines' | PieceSymbolMapping;

    /**
     * Whether the diagrams within the comments (if any) are displayed or not.
     */
    diagramVisible: boolean;

    /**
     * Whether the game headers (if any) are displayed or not.
     */
    headerVisible: boolean;

    /**
     * ID of the selected move (or `'start'`/`'end'` for the beginning/end of the main variation).
     * Use [kokopu.Node#id](https://kokopu.yo35.org/docs/current/classes/Node.html#id) to get the ID of a game move.
     */
    selection?: string;

    /**
     * Type of action allowed with the mouse/keys on the component. If undefined, then the user cannot interact with the component.
     *
     * - `'selectMove'` allows the user to select a move.
     */
    interactionMode?: 'selectMove';

    /**
     * Callback invoked when the user selects a move (only if `interactionMode` is set to `'selectMove'`).
     *
     * @param nodeId - ID of the selected move (as returned by [kokopu.Node#id](https://kokopu.yo35.org/docs/current/classes/Node.html#id)),
     *                 `'start'` for the beginning of the main variation, or `undefined` if the user unselects the previously selected move.
     * @param evtOrigin - Origin of the event. Can be:
     *                    - `'key-first'`: the event has been triggered by the "go-to-first-move" key (aka. the home key),
     *                    - `'key-previous'`: the event has been triggered by the "go-to-previous-move" key (aka. the arrow left key),
     *                    - `'key-next'`: the event has been triggered by the "go-to-next-move" key (aka. the arrow right key),
     *                    - `'key-last'`: the event has been triggered by the "go-to-last-move" key (aka. the end key),
     *                    - `'key-exit'`: the event has been triggered by the "unselect-move" key (aka. the escape key),
     *                    - `'click'`: the event has been triggered by a mouse click on a move.
     */
    onMoveSelected?: (nodeId: string | undefined, evtOrigin: MoveSelectEventOrigin) => void;
}


/**
 * Display a chess game, i.e. the headers (name of the players, event, etc.), the moves, and all the related annotations if any (comments, variations, NAGs...).
 */
export class Movetext extends React.Component<MovetextProps> {

    static defaultProps = {
        game: new Game(),
        gameIndex: 0,
        diagramOptions: {},
        pieceSymbols: 'native',
        diagramVisible: true,
        headerVisible: true,
    };

    private implRef: React.RefObject<MovetextImpl> = React.createRef();

    render() {

        // Validate the game and game-index attributes.
        const info = parseGame(this.props.game, this.props.gameIndex, 'Movetext');
        if (info.error) {
            return info.errorBox;
        }

        // Validate the appearance attributes.
        if (typeof this.props.diagramOptions !== 'object' || this.props.diagramOptions === null) {
            throw new IllegalArgument('Movetext', 'diagramOptions');
        }
        const formatter = moveFormatter(this.props.pieceSymbols);
        const diagramVisible = sanitizeBoolean(this.props.diagramVisible);
        const headerVisible = sanitizeBoolean(this.props.headerVisible);

        // Validate the interaction attributes and the callbacks.
        const selection = sanitizeOptional(this.props.selection, sanitizeString);
        const interactionMode = this.getInteractionMode();
        const { onMoveSelected } = this.props;

        return (
            <MovetextImpl ref={this.implRef}
                game={info.game}
                diagramOptions={this.props.diagramOptions} moveFormatter={formatter} diagramVisible={diagramVisible} headerVisible={headerVisible}
                selection={selection} interactionMode={interactionMode} onMoveSelected={onMoveSelected}
            />
        );
    }

    private getInteractionMode() {
        const interactionMode = sanitizeOptional(this.props.interactionMode, sanitizeString);
        if (interactionMode === undefined || interactionMode === 'selectMove') {
            return interactionMode;
        }
        else {
            throw new IllegalArgument('Movetext', 'interactionMode');
        }
    }

    /**
     * Set the focus to the current component.
     *
     * @public
     */
    focus() {
        const movetextImpl = this.implRef.current;
        // istanbul ignore else
        if (movetextImpl) {
            movetextImpl.focus();
        }
    }

    /**
     * @deprecated
     */
    // istanbul ignore next
    static firstNodeId(game: Game, selection: string): string | undefined {
        return firstNodeIdImpl(game, selection);
    }

    /**
     * @deprecated
     */
    // istanbul ignore next
    static previousNodeId(game: Game, selection: string): string | undefined {
        return previousNodeIdImpl(game, selection);
    }

    /**
     * @deprecated
     */
    // istanbul ignore next
    static nextNodeId(game: Game, selection: string): string | undefined {
        return nextNodeIdImpl(game, selection);
    }

    /**
     * @deprecated
     */
    // istanbul ignore next
    static lastNodeId(game: Game, selection: string): string | undefined {
        return lastNodeIdImpl(game, selection);
    }

}
