/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2025  Yoann Le Montagner <yo35 -at- melix.net>       *
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

import { exception as kokopuException, i18n as kokopuI18n, Database, Game, GameVariant, MoveDescriptor, Position, isGameVariant, pgnRead } from 'kokopu';

import { IllegalArgument } from '../exception';
import { i18n } from '../i18n';

import { ErrorBox } from './ErrorBox';


/**
 * Try to interpret the given object as a chess position.
 */
export function parsePosition(position: Position | string, componentName: string):
    { error: true, errorBox: React.JSX.Element } | { error: false, position: Position } {

    if (position instanceof Position) {
        return { error: false, position: position };
    }
    else if (position === 'start' || position === 'empty') {
        return { error: false, position: new Position(position) };
    }
    else if (typeof position === 'string') {
        try {
            const { variant, fen } = splitGameVariantAndFEN(position);
            const result = new Position(variant, 'empty');
            result.fen(fen);
            return { error: false, position: result };
        }
        catch (e) {
            // istanbul ignore else
            if (e instanceof kokopuException.InvalidFEN) {
                return { error: true, errorBox: <ErrorBox title={i18n.INVALID_FEN_ERROR_TITLE} message={e.message} /> };
            }
            else {
                throw e;
            }
        }
    }
    else {
        throw new IllegalArgument(componentName, 'position');
    }
}


/**
 * Look for an optional 'chess-variant:' prefix in the position attribute.
 */
function splitGameVariantAndFEN(position: string): { variant: GameVariant, fen: string } {
    const separatorIndex = position.indexOf(':');
    if (separatorIndex < 0) {
        return { variant: 'regular', fen: position };
    }
    const variant = position.substring(0, separatorIndex);
    return isGameVariant(variant) ? { variant: variant, fen: position.substring(separatorIndex + 1) } : { variant: 'regular', fen: position };
}


/**
 * Try to interpret the given object `move` as a move descriptor based on the given position.
 */
export function parseMove(position: Position, move: MoveDescriptor | string | undefined, componentName: string):
    { error: true, errorBox: React.JSX.Element } | { error: false, type: 'none' | 'null-move' } | { error: false, type: 'regular', move: MoveDescriptor } {

    if (move === undefined || move === null) {
        return { error: false, type: 'none' };
    }
    else if (move instanceof MoveDescriptor) {
        return { error: false, type: 'regular', move: move };
    }
    else if (typeof move === 'string') {
        if (move === '--') {
            if (position.isNullMoveLegal()) {
                return { error: false, type: 'null-move' };
            }
            else {
                return { error: true, errorBox: <ErrorBox title={i18n.INVALID_NOTATION_ERROR_TITLE} message={kokopuI18n.ILLEGAL_NULL_MOVE} /> };
            }
        }
        else {
            try {
                return { error: false, type: 'regular', move: position.notation(move) };
            }
            catch (e) {
                // istanbul ignore else
                if (e instanceof kokopuException.InvalidNotation) {
                    return { error: true, errorBox: <ErrorBox title={i18n.INVALID_NOTATION_ERROR_TITLE} message={e.message} /> };
                }
                else {
                    throw e;
                }
            }
        }
    }
    else {
        throw new IllegalArgument(componentName, 'move');
    }
}


/**
 * Try to interpret the given object as a chess game.
 */
export function parseGame(game: Game | Database | string, gameIndex: number, componentName: string):
    { error: true, errorBox: React.JSX.Element } | { error: false, game: Game } {

    if (game instanceof Game) {
        return { error: false, game: game };
    }
    else if (game instanceof Database || typeof game === 'string') {
        if (!Number.isInteger(gameIndex) || gameIndex < 0) {
            throw new IllegalArgument(componentName, 'gameIndex');
        }
        try {
            const result = game instanceof Database ? game.game(gameIndex) : pgnRead(game, gameIndex);
            return { error: false, game: result };
        }
        catch (e) {
            // istanbul ignore else
            if (e instanceof kokopuException.InvalidPGN) {
                return {
                    error: true,
                    errorBox: <ErrorBox title={i18n.INVALID_PGN_ERROR_TITLE} message={e.message} text={e.pgn} errorIndex={e.index} lineNumber={e.lineNumber} />,
                };
            }
            else {
                throw e;
            }
        }
    }
    else {
        throw new IllegalArgument(componentName, 'game');
    }
}
