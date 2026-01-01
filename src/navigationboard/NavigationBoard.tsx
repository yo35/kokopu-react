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

import { Database, Game, Node as GameNode, Variation } from 'kokopu';

import { IllegalArgument } from '../exception';
import { i18n } from '../i18n';
import { sanitizeBoolean, sanitizeOptional, sanitizeString, sanitizePartialObject } from '../sanitization';

import { DynamicBoardGraphicProps, defaultDynamicBoardProps } from '../chessboard/BoardProperties';
import { Chessboard } from '../chessboard/Chessboard';
import { parseGame } from '../errorbox/parsing';
import { NavigationField, firstNodeId, previousNodeId, nextNodeId, lastNodeId } from '../navigationboard/NavigationField';
import { GO_FIRST_ICON_PATH, GO_PREVIOUS_ICON_PATH, GO_NEXT_ICON_PATH, GO_LAST_ICON_PATH, PLAY_ICON_PATH, STOP_ICON_PATH, FLIP_ICON_PATH } from './iconPaths';
import { NavigationBar, NavigationBarScheme, isNavigationBar, isNavigationBarScheme } from './NavigationButton';
import { NavigationToolbar, navigationToolbarSize } from './NavigationToolbar';


const INTER_MOVE_DURATION = 1000;


export interface NavigationBoardProps extends DynamicBoardGraphicProps {

    /**
     * Displayed game. Can be a [kokopu.Game](https://kokopu.yo35.org/docs/current/classes/Game.html) object,
     * a [kokopu.Database](https://kokopu.yo35.org/docs/current/classes/Database.html) object,
     * or a [PGN string](https://en.wikipedia.org/wiki/Portable_Game_Notation).
     */
    game: Game | Database | string,

    /**
     * Index of the game to display (only if attribute `game` is a [kokopu.Database](https://kokopu.yo35.org/docs/current/classes/Database.html)
     * or a [PGN string](https://en.wikipedia.org/wiki/Portable_Game_Notation)): `0` for the first game of the database/PGN, `1` for the second one, etc.
     * If omitted, the first game of the database/PGN is displayed.
     */
    gameIndex: number,

    /**
     * ID of the move initially selected (or `'start'`/`'end'` for the beginning/end of the main variation) when the component is uncontrolled.
     * Use [kokopu.Node#id](https://kokopu.yo35.org/docs/current/classes/Node.html#id) to get the ID of a game move.
     * Ignored if the `nodeId` attribute is provided.
     */
    initialNodeId: string,

    /**
     * ID of the selected move (or `'start'`/`'end'` for the beginning/end of the main variation).
     * Use [kokopu.Node#id](https://kokopu.yo35.org/docs/current/classes/Node.html#id) to get the ID of a game move.
     * If provided (i.e. if the component is controlled), the attribute `onNodeIdChanged` must be provided as well.
     */
    nodeId?: string,

    /**
     * Callback invoked in controlled-component mode, when the user changes the selected move.
     *
     * @param nodeId - ID of the selected move (as returned by [kokopu.Node#id](https://kokopu.yo35.org/docs/current/classes/Node.html#id)),
     *                 or `'start'` for the beginning of the main variation.
     */
    onNodeIdChanged?: (nodeId: string) => void,

    /**
     * Whether auto-play is initially enabled or not.
     * Ignored if the `isPlaying` attribute is provided.
     */
    initialIsPlaying: boolean,

    /**
     * Whether auto-play is enabled or not.
     * If provided (i.e. if the is-playing state is controlled), the attribute `onIsPlayingChanged` must be provided as well.
     */
    isPlaying?: boolean,

    /**
     * Callback invoked in controlled-is-playing-state mode, when the user clicks on the play/stop button.
     *
     * @param isPlaying - New is-playing state.
     */
    onIsPlayingChanged?: (isPlaying: boolean) => void,

    /**
     * Whether the board is initially flipped (i.e. seen from Black's point of view) or not, when the flip state is uncontrolled.
     * Ignored if the `flipped` attribute is provided.
     */
    initialFlipped: boolean,

    /**
     * Whether the board is flipped (i.e. seen from Black's point of view) or not.
     * If provided (i.e. if the flip state is controlled), the attribute `onFlippedChanged` must be provided as well.
     */
    flipped?: boolean,

    /**
     * Callback invoked in controlled-flip-state mode, when the user flips the board.
     *
     * @param flipped - New flip state.
     */
    onFlippedChanged?: (flipped: boolean) => void,

    /**
     * Whether the play/stop button is visible or not in the toolbar.
     */
    playButtonVisible: boolean,

    /**
     * Whether the flip button is visible or not in the toolbar.
     */
    flipButtonVisible: boolean,

    /**
     * Additional buttons to be added to the toolbar.
     */
    additionalButtons: NavigationBar,
}


/**
 * Attributes for method `NavigationBoard.size()`.
 */
interface NavigationBoardSizeAttr {
    squareSize?: NavigationBoardProps['squareSize'],
    coordinateVisible?: NavigationBoardProps['coordinateVisible'],
    turnVisible?: NavigationBoardProps['turnVisible'],
    smallScreenLimits?: NavigationBoardProps['smallScreenLimits'],
    playButtonVisible?: NavigationBoardProps['playButtonVisible'],
    flipButtonVisible?: NavigationBoardProps['flipButtonVisible'],
    additionalButtons?: NavigationBarScheme,
}


/**
 * Attributes for method `NavigationBoard.adaptSquareSize()`.
 */
interface NavigationBoardAdaptSquareSizeAttr {
    coordinateVisible?: NavigationBoardProps['coordinateVisible'],
    turnVisible?: NavigationBoardProps['turnVisible'],
    smallScreenLimits?: NavigationBoardProps['smallScreenLimits'],
    playButtonVisible?: NavigationBoardProps['playButtonVisible'],
    flipButtonVisible?: NavigationBoardProps['flipButtonVisible'],
    additionalButtons?: NavigationBarScheme,
}


interface NavigationBoardState {
    nodeIdAsUncontrolled: string,
    isPlayingAsUncontrolled: boolean,
    flippedAsUncontrolled: boolean,
}


/**
 * Component displaying the positions occurring in a chess game, with navigation buttons to browse these positions.
 */
export class NavigationBoard extends React.Component<NavigationBoardProps, NavigationBoardState> {

    static defaultProps = {
        ...defaultDynamicBoardProps(),
        game: new Game(),
        gameIndex: 0,
        initialNodeId: 'start',
        initialIsPlaying: false,
        initialFlipped: false,
        playButtonVisible: false,
        flipButtonVisible: true,
        additionalButtons: [],
    };

    private navigationFieldRef = React.createRef<NavigationField>();
    private timeoutId?: number;

    constructor(props: NavigationBoardProps) {
        super(props);
        this.state = {
            nodeIdAsUncontrolled: sanitizeString(props.initialNodeId),
            isPlayingAsUncontrolled: sanitizeBoolean(props.initialIsPlaying),
            flippedAsUncontrolled: sanitizeBoolean(props.initialFlipped),
        };
    }

    componentWillUnmount() {
        this.cancelCurrentTimeout();
    }

    render() {
        this.cancelCurrentTimeout();

        // Validate the game and game-index attributes.
        const info = parseGame(this.props.game, this.props.gameIndex, 'NavigationBoard');
        if (info.error) {
            return info.errorBox;
        }

        // Fetch the current node/variation.
        const currentNodeId = sanitizeOptional(this.props.nodeId, sanitizeString) ?? this.state.nodeIdAsUncontrolled;
        const currentNode = info.game.findById(currentNodeId) ?? info.game.mainVariation();

        // State flags.
        const isPlaying = sanitizeOptional(this.props.isPlaying, sanitizeBoolean) ?? this.state.isPlayingAsUncontrolled;
        const flipped = sanitizeOptional(this.props.flipped, sanitizeBoolean) ?? this.state.flippedAsUncontrolled;

        return (
            <div className="kokopu-navigationBoard">
                {this.renderBoard(info.game, currentNode, isPlaying, flipped)}
                {this.renderNavigationField(info.game, currentNode.id())}
            </div>
        );
    }

    private renderBoard(game: Game, node: GameNode | Variation, isPlaying: boolean, flipped: boolean) {
        const position = node instanceof GameNode ? node.positionBefore() : node.initialPosition();
        const move = node instanceof GameNode ? node.notation() : undefined;
        return (
            <Chessboard
                position={position} move={move} flipped={flipped}
                squareMarkers={node.tag('csl')} arrowMarkers={node.tag('cal')} textMarkers={node.tag('ctl')}
                squareSize={this.props.squareSize}
                coordinateVisible={this.props.coordinateVisible}
                turnVisible={this.props.turnVisible}
                colorset={this.props.colorset}
                pieceset={this.props.pieceset}
                smallScreenLimits={this.props.smallScreenLimits}
                moveArrowVisible={this.props.moveArrowVisible}
                moveArrowColor={this.props.moveArrowColor}
                animated={this.props.animated}
                bottomComponent={({ squareSize }) => this.renderToolbar(game, node, squareSize, isPlaying)}
            />
        );
    }

    private renderNavigationField(game: Game, currentNodeId: string) {
        return (
            <NavigationField
                ref={this.navigationFieldRef}
                onFirstPressed={() => this.handleNavClicked(firstNodeId(game, currentNodeId))}
                onPreviousPressed={() => this.handleNavClicked(previousNodeId(game, currentNodeId))}
                onNextPressed={() => this.handleNavClicked(nextNodeId(game, currentNodeId))}
                onLastPressed={() => this.handleNavClicked(lastNodeId(game, currentNodeId))}
            />
        );
    }

    private renderToolbar(game: Game, node: GameNode | Variation, squareSize: number, isPlaying: boolean) {

        // WARNING: the logic here must be the same as the one in `computeBarScheme()`.
        const buttons: NavigationBar = [];

        // Core navigation buttons
        const currentNodeId = node.id();
        const hasPrevious = currentNodeId !== 'start';
        const hasNext = (node instanceof Variation ? node.first() : node.next()) !== undefined;
        buttons.push({ iconPath: GO_FIRST_ICON_PATH, tooltip: i18n.TOOLTIP_GO_FIRST, enabled: hasPrevious, onClick: () => this.handleNavClicked(firstNodeId(game, currentNodeId)) });
        buttons.push({ iconPath: GO_PREVIOUS_ICON_PATH, tooltip: i18n.TOOLTIP_GO_PREVIOUS, enabled: hasPrevious, onClick: () => this.handleNavClicked(previousNodeId(game, currentNodeId)) });
        if (sanitizeBoolean(this.props.playButtonVisible)) {
            buttons.push({ iconPath: isPlaying ? STOP_ICON_PATH : PLAY_ICON_PATH, tooltip: i18n.TOOLTIP_PLAY_STOP, enabled: hasNext, onClick: () => this.handlePlayStopClicked(!isPlaying) });
        }
        buttons.push({ iconPath: GO_NEXT_ICON_PATH, tooltip: i18n.TOOLTIP_GO_NEXT, enabled: hasNext, onClick: () => this.handleNavClicked(nextNodeId(game, currentNodeId)) });
        buttons.push({ iconPath: GO_LAST_ICON_PATH, tooltip: i18n.TOOLTIP_GO_LAST, enabled: hasNext, onClick: () => this.handleNavClicked(lastNodeId(game, currentNodeId)) });
        buttons.push('spacer');
        if (sanitizeBoolean(this.props.flipButtonVisible)) {
            buttons.push({ iconPath: FLIP_ICON_PATH, tooltip: i18n.TOOLTIP_FLIP, onClick: () => this.handleFlipButtonClicked() });
        }
        buttons.push('spacer');

        // Schedule the next transition if auto-play is enabled.
        if (isPlaying) {
            if (hasNext) {
                this.timeoutId = window.setTimeout(() => this.handleNavClicked(nextNodeId(game, currentNodeId), false), INTER_MOVE_DURATION);
            }
            else {
                // ... or stop the auto-play if at the end of the game.
                this.timeoutId = window.setTimeout(() => this.handlePlayStopClicked(false, false), 0);
            }
        }

        // Additional buttons.
        if (!isNavigationBar(this.props.additionalButtons)) {
            throw new IllegalArgument('NavigationBoard', 'additionalButtons');
        }
        for (const button of this.props.additionalButtons) {
            buttons.push(button);
        }

        return <NavigationToolbar squareSize={squareSize} buttons={buttons} />;
    }

    private handleNavClicked(targetNodeId: string | undefined, forceFocus = true) {
        if (forceFocus) {
            this.focus();
        }
        if (targetNodeId === undefined) {
            return;
        }

        if (this.props.nodeId === undefined) { // uncontrolled-component behavior
            this.setState({ nodeIdAsUncontrolled: targetNodeId });
        }
        else if (this.props.onNodeIdChanged) { // controlled-component behavior
            this.props.onNodeIdChanged(targetNodeId);
        }
    }

    private handlePlayStopClicked(targetIsPlaying: boolean, forceFocus = true) {
        if (forceFocus) {
            this.focus();
        }
        if (this.props.isPlaying === undefined) { // uncontrolled is-playing state
            this.setState({ isPlayingAsUncontrolled: targetIsPlaying });
        }
        else if (this.props.onIsPlayingChanged) { // controlled is-playing state
            this.props.onIsPlayingChanged(targetIsPlaying);
        }
    }

    private handleFlipButtonClicked() {
        this.focus();
        if (this.props.flipped === undefined) { // uncontrolled flip state
            this.setState({ flippedAsUncontrolled: !this.state.flippedAsUncontrolled });
        }
        else if (this.props.onFlippedChanged) { // controlled flip state
            this.props.onFlippedChanged(!this.props.flipped);
        }
    }

    private cancelCurrentTimeout() {
        if (this.timeoutId !== undefined) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = undefined;
        }
    }

    /**
     * Set the focus to the current component.
     *
     * @public
     */
    focus(): void {
        const target = this.navigationFieldRef.current;
        // istanbul ignore else
        if (target) {
            target.focus();
        }
    }

    /**
     * Return the size of the {@link NavigationBoard}, assuming it is built with the given attributes.
     */
    static size(attr?: NavigationBoardSizeAttr): { width: number, height: number } {
        const { squareSize, coordinateVisible, turnVisible, smallScreenLimits, playButtonVisible, flipButtonVisible, additionalButtons } =
            sanitizePartialObject(attr, () => new IllegalArgument('NavigationBoard.size()', 'attr'));

        // Sanitization
        const actualPlayButtonVisible = sanitizeOptional(playButtonVisible, sanitizeBoolean);
        const actualFlipButtonVisible = sanitizeOptional(flipButtonVisible, sanitizeBoolean);
        if (additionalButtons !== undefined && !isNavigationBarScheme(additionalButtons)) {
            throw new IllegalArgument('NavigationBoard.size()', 'additionalButtons');
        }

        const buttons = computeBarScheme(actualPlayButtonVisible, actualFlipButtonVisible, additionalButtons);
        return Chessboard.size({
            squareSize: squareSize,
            coordinateVisible: coordinateVisible,
            turnVisible: turnVisible,
            smallScreenLimits: smallScreenLimits,
            bottomComponent: ({ squareSize: sz }) => navigationToolbarSize(sz, buttons),
        });
    }

    /**
     * Return the maximum square size that would allow the {@link NavigationBoard} to fit in a rectangle of size `width x height`.
     */
    static adaptSquareSize(width: number, height: number, attr?: NavigationBoardAdaptSquareSizeAttr): number {

        const { coordinateVisible, turnVisible, smallScreenLimits, playButtonVisible, flipButtonVisible, additionalButtons } =
            sanitizePartialObject(attr, () => new IllegalArgument('NavigationBoard.adaptSquareSize()', 'attr'));

        // Sanitization
        const actualPlayButtonVisible = sanitizeOptional(playButtonVisible, sanitizeBoolean);
        const actualFlipButtonVisible = sanitizeOptional(flipButtonVisible, sanitizeBoolean);
        if (additionalButtons !== undefined && !isNavigationBarScheme(additionalButtons)) {
            throw new IllegalArgument('NavigationBoard.adaptSquareSize()', 'additionalButtons');
        }

        const buttons = computeBarScheme(actualPlayButtonVisible, actualFlipButtonVisible, additionalButtons);
        return Chessboard.adaptSquareSize(width, height, {
            coordinateVisible: coordinateVisible,
            turnVisible: turnVisible,
            smallScreenLimits: smallScreenLimits,
            bottomComponent: ({ squareSize: sz }) => navigationToolbarSize(sz, buttons),
        });
    }

}


function computeBarScheme(playButtonVisible: boolean | undefined, flipButtonVisible: boolean | undefined,
    additionalButtons: NavigationBarScheme | undefined): NavigationBarScheme {

    // WARNING: the logic here must be the same as the one in `renderToolbar()`.
    const buttons: NavigationBarScheme = [];

    buttons.push('button'); // go-first
    buttons.push('button'); // go-previous
    if (playButtonVisible ?? NavigationBoard.defaultProps.playButtonVisible) {
        buttons.push('button');
    }
    buttons.push('button'); // go-next
    buttons.push('button'); // go-last
    buttons.push('spacer');
    if (flipButtonVisible ?? NavigationBoard.defaultProps.flipButtonVisible) {
        buttons.push('button');
    }
    buttons.push('spacer');

    if (additionalButtons !== undefined) {
        for (const button of additionalButtons) {
            buttons.push(button);
        }
    }

    return buttons;
}
