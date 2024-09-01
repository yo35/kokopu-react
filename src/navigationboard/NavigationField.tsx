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

import { Game, Variation } from 'kokopu';

import './NavigationField.css';


interface NavigationFieldProps {
    onFirstPressed?: () => void,
    onPreviousPressed?: () => void,
    onNextPressed?: () => void,
    onLastPressed?: () => void,
    onExitPressed?: () => void,
}


/**
 * Invisible field, to capture keyboard events.
 */
export class NavigationField extends React.Component<NavigationFieldProps> {

    private focusFieldRef: React.RefObject<HTMLAnchorElement> = React.createRef();

    render() {
        return (
            <div className="kokopu-focusFieldContainer">
                <a className="kokopu-focusField" href="#" ref={this.focusFieldRef} onKeyDown={evt => this.handleKeyDown(evt)}></a>
            </div>
        );
    }

    private handleKeyDown(evt: React.KeyboardEvent<HTMLAnchorElement>) {
        /* eslint-disable @typescript-eslint/no-unused-expressions */
        doHandleKeyDown(evt, 'Home', this.props.onFirstPressed) ||
        doHandleKeyDown(evt, 'ArrowLeft', this.props.onPreviousPressed) ||
        doHandleKeyDown(evt, 'ArrowRight', this.props.onNextPressed) ||
        doHandleKeyDown(evt, 'End', this.props.onLastPressed) ||
        doHandleKeyDown(evt, 'Escape', this.props.onExitPressed);
        /* eslint-enable */
    }

    /**
     * Set the focus to the component.
     */
    focus(): void {
        const target = this.focusFieldRef.current;
        // istanbul ignore else
        if (target) {
            target.focus();
        }
    }

}


function doHandleKeyDown(evt: React.KeyboardEvent<HTMLAnchorElement>, targetKey: string, targetCallback: (() => void) | undefined) {

    // Skip if the pressed key does not match the target key.
    if (evt.key !== targetKey) {
        return false;
    }

    // Otherwise, invoke the callback.
    if (targetCallback) {
        evt.preventDefault();
        targetCallback();
    }
    return true;
}


/**
 * Return the ID of the main variation in the given chess game.
 * If the given selection corresponds already at the main variation, `undefined` is returned.
 *
 * @param game - Considered chess game.
 * @param selection - ID of the selected move (or `'start'` for the beginning of the main variation).
 * @public
 */
export function firstNodeId(game: Game, selection: string): string | undefined {
    if (!game.findById(selection)) {
        return undefined;
    }
    return selection === 'start' ? undefined : 'start';
}


/**
 * Return the ID of the node immediately preceding the given selection in the given chess game.
 * If no such node exists, `undefined` is returned.
 *
 * @param game - Considered chess game.
 * @param selection - ID of the selected move (or `'start'` for the beginning of the main variation).
 * @public
 */
export function previousNodeId(game: Game, selection: string): string | undefined {
    let currentNode = game.findById(selection);
    if (!currentNode) {
        return undefined;
    }
    if (currentNode instanceof Variation) {
        currentNode = currentNode.parentNode();
        if (!currentNode) {
            return undefined; // This case corresponds to the first variation being selected initially.
        }
    }
    while (currentNode) {
        const previousNode = currentNode.previous();
        if (previousNode) {
            return previousNode.id();
        }
        currentNode = currentNode.parentVariation().parentNode();
    }
    return 'start';
}


/**
 * Return the ID of the node immediately following the given selection in the given chess game.
 * If no such node exists, `undefined` is returned.
 *
 * @param game - Considered chess game.
 * @param selection - ID of the selected move (or `'start'` for the beginning of the main variation).
 * @public
 */
export function nextNodeId(game: Game, selection: string): string | undefined {
    const currentNode = game.findById(selection);
    if (!currentNode) {
        return undefined;
    }
    const nextNode = currentNode instanceof Variation ? currentNode.first() : currentNode.next();
    return nextNode ? nextNode.id() : undefined;
}


/**
 * Return the ID of the node at then end of the variation in which lies the given selection in the given chess game.
 * If the selection is already at the end its variation, `undefined` is returned.
 *
 * @param game - Considered chess game.
 * @param selection - ID of the selected move (or `'start'` for the beginning of the main variation).
 * @public
 */
export function lastNodeId(game: Game, selection: string): string | undefined {
    let currentNode = game.findById(selection);
    if (!currentNode) {
        return undefined;
    }
    currentNode = currentNode instanceof Variation ? currentNode.first() : currentNode.next();
    if (!currentNode) { // Ensure that the input node is not already the last one.
        return undefined;
    }
    let currentNodeNotNull = currentNode;
    while (true) {
        const nextNode = currentNodeNotNull.next();
        if (!nextNode) {
            return currentNodeNotNull.id();
        }
        currentNodeNotNull = nextNode;
    }
}
