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

import { Database, Game, Node as GameNode, Variation } from 'kokopu';

import { sanitizeBoolean, sanitizeOptional, sanitizeString } from '../sanitization';

import { DynamicBoardGraphicProps, defaultDynamicBoardProps } from '../chessboard/BoardProperties';
import { Chessboard } from '../chessboard/Chessboard';
import { parseGame } from '../errorbox/parsing';
import { NavigationField, firstNodeId, previousNodeId, nextNodeId, lastNodeId } from '../navigationboard/NavigationField';
import { NavigationToolbar } from './NavigationToolbar';


export interface NavigationBoardProps extends DynamicBoardGraphicProps {

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
	 * ID of the move initially selected (or `'start'`/`'end'` for the beginning/end of the main variation) when the component is uncontrolled.
	 * Use [kokopu.Node#id](https://kokopu.yo35.org/docs/current/classes/Node.html#id) to get the ID of a game move.
	 * Ignored if the `nodeId` attribute is provided.
	 */
	initialNodeId: string;

	/**
	 * ID of the selected move (or `'start'`/`'end'` for the beginning/end of the main variation).
	 * Use [kokopu.Node#id](https://kokopu.yo35.org/docs/current/classes/Node.html#id) to get the ID of a game move.
	 * If provided (i.e. if the component is controlled), the attribute `onNodeIdChanged` must be provided as well.
	 */
	nodeId?: string;

	/**
	 * Callback invoked in controlled-component mode, when the user changes the selected move.
	 *
	 * @param nodeId - ID of the selected move (as returned by [kokopu.Node#id](https://kokopu.yo35.org/docs/current/classes/Node.html#id)),
	 *                 or `'start'` for the beginning of the main variation.
	 */
	onNodeIdChanged?: (nodeId: string) => void;

	/**
	 * Whether the board is initially flipped (i.e. seen from Black's point of view) or not, when the flip state is uncontrolled.
	 * Ignored if the `flipped` attribute is provided.
	 */
	initialFlipped: boolean;

	/**
	 * Whether the board is flipped (i.e. seen from Black's point of view) or not.
	 * If provided (i.e. if the flip state is controlled), the attribute `onFlippedChanged` must be provided as well.
	 */
	flipped?: boolean;

	/**
	 * Callback invoked in controlled-flip-state mode, when the user flips the board.
	 *
	 * @param flipped - New flip state.
	 */
	onFlippedChanged?: (flipped: boolean) => void;

	/**
	 * Whether the flip button is visible or not in the toolbar.
	 */
	flipButtonVisible: boolean;
}


interface NavigationBoardState {
	nodeIdAsUncontrolled: string;
	flippedAsUncontrolled: boolean;
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
		initialFlipped: false,
		flipButtonVisible: true,
	};

	private navigationFieldRef: React.RefObject<NavigationField> = React.createRef();

	constructor(props: NavigationBoardProps) {
		super(props);
		this.state = {
			nodeIdAsUncontrolled: sanitizeString(props.initialNodeId),
			flippedAsUncontrolled: sanitizeBoolean(props.initialFlipped),
		};
	}

	render() {

		// Validate the game and game-index attributes.
		const info = parseGame(this.props.game, this.props.gameIndex, 'NavigationBoard');
		if (info.error) {
			return info.errorBox;
		}

		// Fetch the current node/variation.
		const currentNodeId = sanitizeOptional(this.props.nodeId, sanitizeString) ?? this.state.nodeIdAsUncontrolled;
		const currentNode = info.game.findById(currentNodeId) ?? info.game.mainVariation();

		// Flip state.
		const flipped = sanitizeOptional(this.props.flipped, sanitizeBoolean) ?? this.state.flippedAsUncontrolled;

		return (
			<div className="kokopu-navigationBoard">
				{this.renderBoard(info.game, currentNode, flipped)}
				{this.renderNavigationField(info.game, currentNode.id())}
			</div>
		);
	}

	private renderBoard(game: Game, node: GameNode | Variation, flipped: boolean) {
		const position = node instanceof GameNode ? node.positionBefore() : node.initialPosition();
		const move = node instanceof GameNode ? node.notation() : undefined;
		return <Chessboard
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
			bottomComponent={({ squareSize }) => this.renderToolbar(game, node.id(), squareSize)}
		/>;
	}

	private renderNavigationField(game: Game, currentNodeId: string) {
		return <NavigationField ref={this.navigationFieldRef}
			onFirstPressed={() => this.handleNavigationButtonClicked(firstNodeId(game, currentNodeId))}
			onPreviousPressed={() => this.handleNavigationButtonClicked(previousNodeId(game, currentNodeId))}
			onNextPressed={() => this.handleNavigationButtonClicked(nextNodeId(game, currentNodeId))}
			onLastPressed={() => this.handleNavigationButtonClicked(lastNodeId(game, currentNodeId))}
		/>;
	}

	private renderToolbar(game: Game, currentNodeId: string, squareSize: number) {
		const flipButtonVisible = sanitizeBoolean(this.props.flipButtonVisible);
		return <NavigationToolbar flipButtonVisible={flipButtonVisible} squareSize={squareSize}
			onFirstClicked={() => this.handleNavigationButtonClicked(firstNodeId(game, currentNodeId))}
			onPreviousClicked={() => this.handleNavigationButtonClicked(previousNodeId(game, currentNodeId))}
			onNextClicked={() => this.handleNavigationButtonClicked(nextNodeId(game, currentNodeId))}
			onLastClicked={() => this.handleNavigationButtonClicked(lastNodeId(game, currentNodeId))}
			onFlipClicked={() => this.handleFlipButtonClicked()}
		/>;
	}

	private handleNavigationButtonClicked(targetNodeId: string | undefined) {
		this.focus();
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

	private handleFlipButtonClicked() {
		this.focus();
		if (this.props.flipped === undefined) { // uncontrolled flip state
			this.setState({ flippedAsUncontrolled: !this.state.flippedAsUncontrolled });
		}
		else if (this.props.onFlippedChanged) { // controlled flip state
			this.props.onFlippedChanged(!this.props.flipped);
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

}
