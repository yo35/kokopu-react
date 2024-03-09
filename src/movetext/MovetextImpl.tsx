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

import { Game, Color, GameResult, Node as GameNode, Variation, nagSymbol } from 'kokopu';

import { i18n } from '../i18n';
import { fillPlaceholder } from '../util';

import { StaticBoardGraphicProps } from '../chessboard/BoardProperties';
import { Chessboard } from '../chessboard/Chessboard';
import { NavigationField, firstNodeId, previousNodeId, nextNodeId, lastNodeId } from '../navigationboard/NavigationField';
import { htmlFilter } from './htmlFilter';

import './Movetext.css';


interface MovetextImplProps {

    game: Game;

    diagramOptions: Partial<StaticBoardGraphicProps> & {
        flipped?: boolean,
    };
    moveFormatter: (notation: string) => React.ReactNode;
    diagramVisible: boolean;
    headerVisible: boolean;

    selection?: string;
    interactionMode?: 'selectMove';

    onMoveSelected?: (nodeId: string | undefined, evtOrigin: 'key-first' | 'key-previous' | 'key-next' | 'key-last' | 'key-exit' | 'click') => void;
}


/**
 * Implementation of {@link Movetext}.
 *
 * This implementation assumes that all the parameter sanitization has been performed beforehand.
 */
export class MovetextImpl extends React.Component<MovetextImplProps> {

    private navigationFieldRef: React.RefObject<NavigationField> = React.createRef();

    render() {
        return (
            <div className="kokopu-movetext">
                {this.renderHeaders()}
                {this.renderBody()}
                {this.renderNavigationField()}
            </div>
        );
    }

    private renderHeaders() {
        if (!this.props.headerVisible) {
            return undefined;
        }

        const filter = htmlFilter('header');
        const headers: React.ReactNode[] = [];
        headers.push(this.renderPlayerHeaders(filter, 'w'));
        headers.push(this.renderPlayerHeaders(filter, 'b'));
        headers.push(this.renderEventRoundHeaders(filter));
        headers.push(this.renderDateSiteHeaders(filter));
        headers.push(this.renderAnnotatorHeader(filter));
        return headers.some(element => element !== undefined) ? <div className="kokopu-headers">{headers}</div> : undefined;
    }

    /**
     * Header containing the player-related information (name, rating, title) corresponding to the given color.
     */
    private renderPlayerHeaders(filter: (text: string) => React.ReactNode, color: Color) {
        const playerName = this.props.game.playerName(color);
        if (playerName === undefined) {
            return undefined;
        }
        const title = this.props.game.playerTitle(color);
        const rating = this.props.game.playerElo(color);

        const classNames = [ 'kokopu-headerGroup-player', color === 'w' ? 'kokopu-headerGroup-whitePlayer' : 'kokopu-headerGroup-blackPlayer' ];
        const colorTag = <span className="kokopu-colorTag"></span>;
        const playerNameElement = <span className="kokopu-header-playerName">{filter(playerName)}</span>;
        const titleElement = title === undefined ? undefined : <span className="kokopu-header-playerTitle">{filter(title)}</span>;
        const ratingElement = rating === undefined ? undefined : <span className="kokopu-header-playerRating">{rating}</span>;
        const separator = title === undefined || rating === undefined ? undefined : '\u00a0'; // \u00a0 == &nbsp;
        const titleRatingGroup = title === undefined && rating === undefined ? undefined :
            <span className="kokopu-headerGroup-titleRating">{titleElement}{separator}{ratingElement}</span>;
        return <div className={classNames.join(' ')} key={'player-' + color}>{colorTag}{playerNameElement}{titleRatingGroup}</div>;
    }

    /**
     * Header containing the event-related information: event + round.
     */
    private renderEventRoundHeaders(filter: (text: string) => React.ReactNode) {
        const evt = this.props.game.event();
        if (evt === undefined) {
            return undefined;
        }
        const fullRound = this.props.game.fullRound();
        const roundElement = fullRound === undefined ? undefined : <span className="kokopu-header-round">{fullRound}</span>;
        const evtElement = <span className="kokopu-header-event">{filter(evt)}</span>;
        return <div className="kokopu-headerGroup-eventRound" key="event-round">{evtElement}{roundElement}</div>;
    }

    /**
     * Header containing the date/place information.
     */
    private renderDateSiteHeaders(filter: (text: string) => React.ReactNode) {
        const date = this.props.game.dateAsString();
        const site = this.props.game.site();
        if (date === undefined && site === undefined) {
            return undefined;
        }
        const dateElement = date === undefined ? undefined : <span className="kokopu-header-date">{capitalizeFirstWord(date)}</span>;
        const siteElement = site === undefined ? undefined : <span className="kokopu-header-site">{filter(site)}</span>;
        const separator = date === undefined || site === undefined ? undefined : '\u00a0\u2013\u00a0'; // \u00a0 == &nbsp;   \u2013 == &ndash;
        return <div className="kokopu-headerGroup-dateSite" key="date-site">{dateElement}{separator}{siteElement}</div>;
    }

    /**
     * Header containing the annotator information.
     */
    private renderAnnotatorHeader(filter: (text: string) => React.ReactNode) {
        const annotator = this.props.game.annotator();
        if (annotator === undefined) {
            return undefined;
        }
        return <div className="kokopu-header-annotator" key="annotator">{filter(fillPlaceholder(i18n.ANNOTATED_BY, annotator))}</div>;
    }

    private renderNavigationField() {
        if (this.props.interactionMode !== 'selectMove') {
            return undefined;
        }
        return <NavigationField ref={this.navigationFieldRef}
            onFirstPressed={() => this.handleNavigationPressed(firstNodeId, 'key-first')}
            onPreviousPressed={() => this.handleNavigationPressed(previousNodeId, 'key-previous')}
            onNextPressed={() => this.handleNavigationPressed(nextNodeId, 'key-next')}
            onLastPressed={() => this.handleNavigationPressed(lastNodeId, 'key-last')}
            onExitPressed={() => this.handleExitPressed()}
        />;
    }

    private renderBody() {
        const filter = htmlFilter('comment');
        return this.renderVariation(filter, this.props.game.mainVariation(), true, this.props.game.result());
    }

    /**
     * Render the given variation and its sub-variations, recursively.
     */
    private renderVariation(filter: (text: string) => React.ReactNode, variation: Variation, isMainVariation: boolean, gameResult?: GameResult) {

        const moveGroups: React.ReactNode[] = []; // ... and also long comments and long sub-variations
        let currentMoveGroupElements: React.ReactNode[] = [];

        // Close the current move group, if any.
        function closeMoveGroup() {
            if (!variation.isLongVariation() || currentMoveGroupElements.length === 0) {
                return;
            }
            moveGroups.push(<div className="kokopu-moveGroup" key={'group-' + moveGroups.length}>{currentMoveGroupElements}</div>);
            currentMoveGroupElements = [];
        }

        // Write the initial comment, if any.
        const variationComment = this.extractComment(variation);
        if (variationComment !== undefined) {
            if (variation.isLongComment()) {
                moveGroups.push(this.renderComment(filter, variation, variationComment));
            }
            else {
                currentMoveGroupElements.push(this.renderComment(filter, variation, variationComment));
            }
        }

        // Visit all the PGN nodes (one node per move) within the variation.
        let forcePrintMoveNumber = true;
        let node = variation.first();
        while (node !== undefined) {

            // Write the move, including directly related information (i.e. move number + NAGs).
            currentMoveGroupElements.push(this.renderMove(node, forcePrintMoveNumber));

            // Write the comment (if any).
            const nodeComment = this.extractComment(node);
            if (nodeComment !== undefined) {
                if (node.isLongComment()) {
                    closeMoveGroup();
                    moveGroups.push(this.renderComment(filter, node, nodeComment));
                }
                else {
                    currentMoveGroupElements.push(this.renderComment(filter, node, nodeComment));
                }
            }

            // Write the sub-variations.
            let hasNonEmptySubVariations = false;
            for (const subVariation of node.variations()) {
                const subVariationElement = this.renderVariation(filter, subVariation, false);
                if (subVariationElement) {
                    if (subVariation.isLongVariation()) {
                        closeMoveGroup();
                        moveGroups.push(subVariationElement);
                    }
                    else {
                        currentMoveGroupElements.push(subVariationElement);
                    }
                    hasNonEmptySubVariations = true;
                }
            }

            // Back to the current variation, go to the next move.
            forcePrintMoveNumber = (nodeComment !== undefined || hasNonEmptySubVariations);
            node = node.next();
        }

        // Append the game result at the end of the main variation.
        if (isMainVariation && gameResult !== '*') {
            currentMoveGroupElements.push(<span className="kokopu-gameResult" key="game-result">{formatResult(gameResult!)}</span>);
        }

        // Close the last move group, and return the result.
        closeMoveGroup();
        const elements = variation.isLongVariation() ? moveGroups : currentMoveGroupElements;
        if (elements.length === 0) {
            return undefined;
        }
        if (isMainVariation) {
            return <div className="kokopu-variation kokopu-mainVariation" key={variation.id()}>{elements}</div>;
        }
        else if (variation.isLongVariation()) {
            return <div className="kokopu-variation kokopu-subVariation" key={variation.id()}>{elements}</div>;
        }
        else {
            return <span className="kokopu-variation kokopu-subVariation" key={variation.id()}>{elements}</span>;
        }
    }

    /**
     * Render the given move, move number, and NAG (if any).
     */
    private renderMove(node: GameNode, forcePrintMoveNumber: boolean) {

        // Move number
        let moveNumber: React.ReactNode = undefined;
        if (forcePrintMoveNumber || node.moveColor() === 'w') {
            const moveNumberText  = node.fullMoveNumber() + (node.moveColor() === 'w' ? '.' : '\u2026');
            moveNumber = <span className="kokopu-moveNumber">{moveNumberText}</span>;
        }

        // SAN notation.
        const notationText = this.props.moveFormatter(node.notation());

        // NAGs
        const nagElements = node.nags().map(nag => <span className="kokopu-nag" key={nag}>{nagSymbol(nag)}</span>);

        // Class
        const nodeId = node.id();
        const moveClassNames = [ 'kokopu-move' ];
        let onClick: (() => void) | undefined = undefined;
        if (this.props.selection && this.props.selection === nodeId) {
            moveClassNames.push('kokopu-selectedMove');
        }
        if (this.props.interactionMode === 'selectMove') {
            moveClassNames.push('kokopu-clickableMove');
            onClick = () => this.handleNodeClicked(nodeId);
        }

        return (
            <span className={moveClassNames.join(' ')} key={node.id()}>
                <span className="kokopu-moveContent" onClick={onClick}>
                    {moveNumber}
                    <span className="kokopu-moveNotation">{notationText}</span>
                    {nagElements.length === 0 ? undefined : nagElements}
                </span>
            </span>
        );
    }

    /**
     * Render the given text comment with its diagrams, if any.
     */
    private renderComment(filter: (text: string) => React.ReactNode, node: GameNode | Variation, comment: string) {
        let content: React.ReactNode;
        if (this.props.diagramVisible && comment.includes('[#]')) {
            const segmentElements: React.ReactNode[] = [];
            let isFirstTextSegment = true;
            let diagramIndex = 0;
            for (let textSegment of comment.split('[#]')) {
                if (!isFirstTextSegment) {
                    const position = node instanceof Variation ? node.initialPosition() : node.position();
                    const diagram = <Chessboard
                        position={position}
                        squareMarkers={node.tag('csl')} arrowMarkers={node.tag('cal')} textMarkers={node.tag('ctl')}
                        flipped={this.props.diagramOptions.flipped}
                        squareSize={this.props.diagramOptions.squareSize}
                        coordinateVisible={this.props.diagramOptions.coordinateVisible}
                        turnVisible={this.props.diagramOptions.turnVisible}
                        colorset={this.props.diagramOptions.colorset}
                        pieceset={this.props.diagramOptions.pieceset}
                        smallScreenLimits={this.props.diagramOptions.smallScreenLimits}
                    />;
                    segmentElements.push(<div className="kokopu-diagram" key={'diagram-' + (diagramIndex++)}>{diagram}</div>);
                }
                isFirstTextSegment = false;
                textSegment = textSegment.trim();
                if (textSegment.length !== 0) {
                    segmentElements.push(filter(textSegment));
                }
            }
            content = segmentElements;
        }
        else {
            content = filter(comment);
        }
        const key = node.id() + '-comment';
        return node.isLongComment() ? <div className="kokopu-comment" key={key}>{content}</div> : <span className="kokopu-comment" key={key}>{content}</span>;
    }

    private extractComment(node: GameNode | Variation) {
        let comment = node.comment();
        if (comment) {

            // Remove the diagrams if necessary.
            if (!this.props.diagramVisible) {
                comment = comment.replace(/\[#\]/g, ' ');
            }

            // Trim and sanitize the space characters.
            comment = comment.replace(/\s+/g, ' ').trim();
        }
        return comment ? comment : undefined;
    }

    private handleNavigationPressed(transition: (game: Game, nodeId: string) => string | undefined, evtOrigin: 'key-first' | 'key-previous' | 'key-next' | 'key-last') {
        if (this.props.selection) {
            this.fireMoveSelected(transition(this.props.game, this.props.selection), evtOrigin);
        }
    }

    private handleExitPressed() {
        if (this.props.selection && this.props.game.findById(this.props.selection)) {
            this.fireMoveSelected(undefined, 'key-exit');
        }
    }

    private fireMoveSelected(nodeId: string | undefined, evtOrigin: 'key-first' | 'key-previous' | 'key-next' | 'key-last' | 'key-exit') {
        if ((nodeId || evtOrigin === 'key-exit') && this.props.onMoveSelected) {
            this.props.onMoveSelected(nodeId, evtOrigin);
        }
    }

    private handleNodeClicked(nodeId: string) {
        this.focus();
        if (this.props.onMoveSelected) {
            this.props.onMoveSelected(nodeId === this.props.selection ? undefined : nodeId, 'click');
        }
    }

    /**
     * Set the focus to the current component.
     */
    focus(): void {
        const target = this.navigationFieldRef.current;
        // istanbul ignore else
        if (target) {
            target.focus();
        }
    }

}


/**
 * Example: `'hello world'` is turned into `'Hello world'`.
 */
function capitalizeFirstWord(text: string) {
    return text.length === 0 ? '' : text.charAt(0).toUpperCase() + text.slice(1);
}


function formatResult(result: GameResult) {
    switch (result) {
        case '1/2-1/2': return '\u00bd\u2013\u00bd';
        case '1-0': return '1\u20130';
        case '0-1': return '0\u20131';
    }
}
