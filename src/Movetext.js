/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2022  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    This program is free software: you can redistribute it and/or           *
 *    modify it under the terms of the GNU Lesser General Public License      *
 *    as published by the Free Software Foundation, either version 3 of       *
 *    the License, or (at your option) any later version.                     *
 *                                                                            *
 *    This program is distributed in the hope that it will be useful,         *
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of          *
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the            *
 *    GNU Lesser General Public License for more details.                     *
 *                                                                            *
 *    You should have received a copy of the GNU Lesser General               *
 *    Public License along with this program. If not, see                     *
 *    <http://www.gnu.org/licenses/>.                                         *
 *                                                                            *
 ******************************************************************************/


import PropTypes from 'prop-types';
import React from 'react';
import kokopu from 'kokopu';

import HtmlSanitizer from './impl/HtmlSanitizer';
import Chessboard from './Chessboard';
import ErrorBox from './ErrorBox';
import i18n from './i18n';

import './css/fonts.css';
import './css/movetext.css';


/**
 * Display a chess game, i.e. the headers (name of the players, event, etc.), the moves, and all the related annotations if any (comments, variations, NAGs...).
 */
export default class Movetext extends React.Component {

	constructor(props) {
		super(props);
		this.focusFieldRef = React.createRef();
	}

	render() {
		let info = parseGame(this.props.game, this.props.gameIndex);
		if (info.error) {
			return <ErrorBox title={i18n.INVALID_PGN_ERROR_TITLE} message={info.message} text={info.text} errorIndex={info.errorIndex} lineNumber={info.lineNumber} />;
		}
		return (
			<div className="kokopu-movetext">
				{this.renderHeaders(info.game)}
				{this.renderBody(info.game)}
				{this.renderFocusField()}
			</div>
		);
	}

	renderHeaders(game) {
		if (!this.props.headerVisible) {
			return undefined;
		}
		let headers = [];
		headers.push(this.renderPlayerHeaders(game, 'w'));
		headers.push(this.renderPlayerHeaders(game, 'b'));
		headers.push(this.renderEventRoundHeaders(game));
		headers.push(this.renderDateSiteHeaders(game));
		headers.push(this.renderAnnotatorHeader(game));
		return headers.some(element => element !== undefined) ? <div className="kokopu-headers">{headers}</div> : undefined;
	}

	/**
	 * Header containing the player-related information (name, rating, title) corresponding to the given color.
	 */
	renderPlayerHeaders(game, color) {
		let playerName = game.playerName(color);
		if (playerName === undefined) {
			return undefined;
		}
		let title = game.playerTitle(color);
		let rating = game.playerElo(color);

		let classNames = [ 'kokopu-headerGroup-player', color === 'w' ? 'kokopu-headerGroup-whitePlayer' : 'kokopu-headerGroup-blackPlayer' ];
		let colorTag = <span className="kokopu-colorTag"></span>;
		let playerNameElement = <span className="kokopu-header-playerName">{sanitizeHtml(playerName)}</span>;
		let titleElement = title === undefined ? undefined : <span className="kokopu-header-playerTitle">{sanitizeHtml(title)}</span>;
		let ratingElement = rating === undefined ? undefined : <span className="kokopu-header-playerRating">{sanitizeHtml(rating)}</span>;
		let separator = title === undefined || rating === undefined ? undefined : '\u00a0'; // \u00a0 == &nbsp;
		let titleRatingGroup = title === undefined && rating === undefined ? undefined : <span className="kokopu-headerGroup-titleRating">{titleElement}{separator}{ratingElement}</span>;
		return <div className={classNames.join(' ')} key={'player-' + color}>{colorTag}{playerNameElement}{titleRatingGroup}</div>;
	}

	/**
	 * Header containing the event-related information: event + round.
	 */
	renderEventRoundHeaders(game) {
		let evt = game.event();
		if (evt === undefined) {
			return undefined;
		}
		let round = game.round();
		let roundElement = round === undefined ? undefined : <span className="kokopu-header-round">{sanitizeHtml(round)}</span>;
		let evtElement = <span className="kokopu-header-event">{sanitizeHtml(evt)}</span>;
		return <div className="kokopu-headerGroup-eventRound" key="event-round">{evtElement}{roundElement}</div>;
	}

	/**
	 * Header containing the date/place information.
	 */
	renderDateSiteHeaders(game) {
		let date = game.date();
		let site = game.site();
		if(date === undefined && site === undefined) {
			return undefined;
		}
		let dateElement = date === undefined ? undefined : <span className="kokopu-header-date">{capitalizeFirstWord(game.dateAsString())}</span>;
		let siteElement = site === undefined ? undefined : <span className="kokopu-header-site">{sanitizeHtml(site)}</span>;
		let separator = date === undefined || site === undefined ? undefined : '\u00a0\u2013\u00a0'; // \u00a0 == &nbsp;   \u2013 == &ndash;
		return <div className="kokopu-headerGroup-dateSite" key="date-site">{dateElement}{separator}{siteElement}</div>;
	}

	/**
	 * Header containing the annotator information.
	 */
	renderAnnotatorHeader(game) {
		let annotator = game.annotator();
		if (annotator === undefined) {
			return undefined;
		}
		annotator = i18n.ANNOTATED_BY.replace(/\{0\}/g, annotator);
		return <div className="kokopu-header-annotator" key="annotator">{sanitizeHtml(annotator)}</div>;
	}

	renderFocusField() {
		if (this.props.interactionMode !== 'selectMove') {
			return undefined;
		}
		return (
			<div className="kokopu-focusFieldContainer">
				<a className="kokopu-focusField" href="#" ref={this.focusFieldRef} onKeyDown={evt => this.handleKeyDownInFocusField(evt)}></a>
			</div>
		);
	}

	renderBody(game) {
		return this.renderVariation(this.getNotationTextBuilder(), game.mainVariation(), 'main-variation', true, game.result());
	}

	/**
	 * Render the given variation and its sub-variations, recursively.
	 */
	renderVariation(notationTextBuilder, variation, variationKey, isMainVariation, gameResult) {

		let moveGroups = []; // ... and also long comments and long sub-variations
		let currentMoveGroupElements = [];

		// Close the current move group, if any.
		function closeMoveGroup() {
			if (!variation.isLongVariation() || currentMoveGroupElements.length === 0) {
				return;
			}
			moveGroups.push(<div className="kokopu-moveGroup" key={'group-' + moveGroups.length}>{currentMoveGroupElements}</div>);
			currentMoveGroupElements = [];
		}

		// Write the initial comment, if any.
		let variationComment = this.extractComment(variation);
		if (variationComment !== undefined) {
			if (variation.isLongComment()) {
				moveGroups.push(this.renderComment(variation, variationComment, true));
			}
			else {
				currentMoveGroupElements.push(this.renderComment(variation, variationComment, true));
			}
		}

		// Visit all the PGN nodes (one node per move) within the variation.
		let forcePrintMoveNumber = true;
		let node = variation.first();
		while (node !== undefined) {

			// Write the move, including directly related information (i.e. move number + NAGs).
			currentMoveGroupElements.push(this.renderMove(notationTextBuilder, node, forcePrintMoveNumber));

			// Write the comment (if any).
			let nodeComment = this.extractComment(node);
			if (nodeComment !== undefined) {
				if (node.isLongComment()) {
					closeMoveGroup();
					moveGroups.push(this.renderComment(node, nodeComment, false));
				}
				else {
					currentMoveGroupElements.push(this.renderComment(node, nodeComment, false));
				}
			}

			// Write the sub-variations.
			let hasNonEmptySubVariations = false;
			for (let [index, subVariation] of node.variations().entries()) {
				let subVariationElement = this.renderVariation(notationTextBuilder, subVariation, node.fullMoveNumber() + node.moveColor() + '-variation-' + index, false);
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
			currentMoveGroupElements.push(<span className="kokopu-gameResult" key="gameResult">{formatResult(gameResult)}</span>);
		}

		// Close the last move group, and return the result.
		closeMoveGroup();
		let elements = variation.isLongVariation() ? moveGroups : currentMoveGroupElements;
		if (elements.length === 0) {
			return undefined;
		}
		if (isMainVariation) {
			return <div className="kokopu-variation kokopu-mainVariation" key={variationKey}>{elements}</div>;
		}
		else if (variation.isLongVariation()) {
			return <div className="kokopu-variation kokopu-subVariation" key={variationKey}>{elements}</div>;
		}
		else {
			return <span className="kokopu-variation kokopu-subVariation" key={variationKey}>{elements}</span>;
		}
	}

	/**
	 * Render the given move, move number, and NAG (if any).
	 */
	renderMove(notationTextBuilder, node, forcePrintMoveNumber) {

		// Move number
		let moveNumber = undefined;
		if (forcePrintMoveNumber || node.moveColor() === 'w') {
			let moveNumberText  = node.fullMoveNumber() + (node.moveColor() === 'w' ? '.' : '\u2026');
			moveNumber = <span className="kokopu-moveNumber">{moveNumberText}</span>;
		}

		// SAN notation.
		let notationText = notationTextBuilder(node.notation());

		// NAGs
		let nagElements = node.nags().map(nag => <span className="kokopu-nag" key={nag}>{kokopu.nagSymbol(nag)}</span>);

		// Class
		let nodeId = node.id();
		let moveClassNames = [ 'kokopu-move' ];
		let onClick = undefined;
		if (this.props.selection && this.props.selection === nodeId) {
			moveClassNames.push('kokopu-selectedMove');
		}
		if (this.props.interactionMode === 'selectMove') {
			moveClassNames.push('kokopu-clickableMove');
			onClick = () => this.handleNodeClicked(nodeId);
		}

		return (
			<span className={moveClassNames.join(' ')} key={node.fullMoveNumber() + node.moveColor()}>
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
	renderComment(node, comment, isVariation) {
		let content;
		if (this.props.diagramVisible && comment.includes('[#]')) {
			content = [];
			let sanitizer = createSanitizer();
			let isFirstPart = true;
			for (let [index, part] of comment.split('[#]').entries()) {
				if (!isFirstPart) {
					let position = isVariation ? node.initialPosition() : node.position();
					let diagram = <Chessboard position={position} squareMarkers={node.tag('csl')} arrowMarkers={node.tag('cal')} textMarkers={node.tag('ctl')}
						flipped={this.props.diagramOptions.flipped}
						squareSize={this.props.diagramOptions.squareSize}
						coordinateVisible={this.props.diagramOptions.coordinateVisible}
						smallScreenLimits={this.props.diagramOptions.smallScreenLimits}
						colorset={this.props.diagramOptions.colorset}
						pieceset={this.props.diagramOptions.pieceset}
					/>;
					content.push(<div className="kokopu-diagram" key={'diagram-' + index}>{diagram}</div>);
				}
				isFirstPart = false;
				part = part.trim();
				if (part.length !== 0) {
					content.push(sanitizeHtml(part, sanitizer));
				}
			}
		}
		else {
			content = sanitizeHtml(comment);
		}
		let key = isVariation ? 'initial-comment' : node.fullMoveNumber() + node.moveColor() + '-comment';
		return node.isLongComment() ? <div className="kokopu-comment" key={key}>{content}</div> : <span className="kokopu-comment" key={key}>{content}</span>;
	}

	extractComment(node) {
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

	handleKeyDownInFocusField(evt) {
		if (!this.props.selection) {
			return;
		}
		let game = parseGame(this.props.game, this.props.gameIndex).game;
		let nodeId = false;
		let evtOrigin = '';
		if (this.props.selection === 'start') {
			if (evt.key === 'ArrowRight') {
				nodeId = getNextNodeId(game.mainVariation(), true);
				evtOrigin = 'key-next';
			}
			else if (evt.key === 'End') {
				nodeId = getLastNodeId(game.mainVariation(), true);
				evtOrigin = 'key-last';
			}
		}
		else {
			let currentNode = game.findById(this.props.selection);
			if (!currentNode) {
				return;
			}
			if (evt.key === 'Home') {
				nodeId = 'start';
				evtOrigin = 'key-first';
			}
			else if (evt.key === 'ArrowLeft') {
				nodeId = getPreviousNodeId(currentNode);
				evtOrigin = 'key-previous';
			}
			else if (evt.key === 'ArrowRight') {
				nodeId = getNextNodeId(currentNode, false);
				evtOrigin = 'key-next';
			}
			else if (evt.key === 'End') {
				nodeId = getLastNodeId(currentNode, false);
				evtOrigin = 'key-last';
			}
		}
		if (nodeId && this.props.onMoveSelected) {
			this.props.onMoveSelected(nodeId, evtOrigin);
		}
	}

	handleNodeClicked(nodeId) {
		this.focusFieldRef.current.focus();
		if (this.props.onMoveSelected) {
			this.props.onMoveSelected(nodeId === this.props.selection ? undefined : nodeId, 'click');
		}
	}

	/**
	 * Return the square at the given location.
	 */
	getNotationTextBuilder() {
		let pieceSymbols = this.props.pieceSymbols;
		if (pieceSymbols === 'localized') {
			let mapping = i18n.PIECE_SYMBOLS;
			return notation => notation.replace(/[KQRBNP]/g, match => mapping[match]);
		}
		else if (pieceSymbols === 'figurines') {
			return notation => figurineNotation(notation, 'alpha');
		}
		else if (pieceSymbols !== 'native' && pieceSymbols && ['K', 'Q', 'R', 'B', 'N', 'P'].every(p => typeof pieceSymbols[p] === 'string')) {
			return notation => notation.replace(/[KQRBNP]/g, match => pieceSymbols[match]);
		}
		else {
			return notation => notation;
		}
	}
}


Movetext.propTypes = {

	/**
	 * Displayed position. Can be a [kokopu.Game](https://kokopu.yo35.org/docs/Game.html) object,
	 * a [kokopu.Database](https://kokopu.yo35.org/docs/Database.html) object,
	 * or a [PGN string](https://en.wikipedia.org/wiki/Portable_Game_Notation).
	 */
	game: PropTypes.oneOfType([
		PropTypes.instanceOf(kokopu.Game),
		PropTypes.instanceOf(kokopu.Database),
		PropTypes.string
	]),

	/**
	 * Index of the game to display (only if attribute `game` is a [kokopu.Database](https://kokopu.yo35.org/docs/Database.html)
	 * or a [PGN string](https://en.wikipedia.org/wiki/Portable_Game_Notation)): `0` for the first game of the database/PGN, `1` for the second one, etc.
	 * If omitted, the first game of the database/PGN is displayed.
	 */
	gameIndex: PropTypes.number,

	/**
	 * Options applicable to the diagrams in the comments. See [Chessboard](#/Components/Chessboard) for more details about each option.
	 */
	diagramOptions: PropTypes.shape({
		flipped: Chessboard.propTypes.flipped,
		squareSize: Chessboard.propTypes.squareSize,
		coordinateVisible: Chessboard.propTypes.coordinateVisible,
		smallScreenLimits: Chessboard.propTypes.smallScreenLimits,
		colorset: Chessboard.propTypes.colorset,
		pieceset: Chessboard.propTypes.pieceset,
	}),

	/**
	 * Symbols to use for the chess pieces. Can be:
	 * - `'native'`: use the first letter of the piece names (in English),
	 * - `'localized'`: use the symbols defined by `i18n.PIECE_SYMBOLS`,
	 * - `'figurines'`: use the figurines,
	 * - or an object defining 6 string-valued properties named `K`, `Q`, `R`, `B`, `N` and `P`.
	 */
	pieceSymbols: PropTypes.oneOfType([
		PropTypes.oneOf([ 'native', 'localized', 'figurines' ]),
		PropTypes.shape({
			K: PropTypes.string.isRequired,
			Q: PropTypes.string.isRequired,
			R: PropTypes.string.isRequired,
			B: PropTypes.string.isRequired,
			N: PropTypes.string.isRequired,
			P: PropTypes.string.isRequired
		})
	]),

	/**
	 * Whether the diagrams within the comments (if any) are displayed or not.
	 */
	diagramVisible: PropTypes.bool,

	/**
	 * Whether the game headers (if any) are displayed or not.
	 */
	headerVisible: PropTypes.bool,

	/**
	 * ID of the selected move (or `'start'` for the beginning of the main variation).
	 * Use [kokopu.Node#id](https://kokopu.yo35.org/docs/Node.html#id) to get the ID of a game move.
	 */
	selection: PropTypes.string,

	/**
	 * Type of action allowed with the mouse/keys on the component. If undefined, then the user cannot interact with the component.
	 *
	 * - `'selectMove'` allows the user to select a move.
	 */
	interactionMode: PropTypes.oneOf([ 'selectMove' ]),

	/**
	 * Callback invoked when the user selects a move (only if `interactionMode` is set to `'selectMove'`).
	 *
	 * @param {string?} nodeId ID of the selected move (as returned by [kokopu.Node#id](https://kokopu.yo35.org/docs/Node.html#id)),
	 *                         `'start'` for the beginning of the main variation, or `undefined` if the user unselects the previously selected move.
	 * @param {string} evtOrigin Origin of the event. Can be:
	 *                        - `'key-first'`: the event has been triggered by the "go-to-first-move" key (aka. the home key),
	 *                        - `'key-previous'`: the event has been triggered by the "go-to-previous-move" key (aka. the arrow left key),
	 *                        - `'key-next'`: the event has been triggered by the "go-to-next-move" key (aka. the arrow right key),
	 *                        - `'key-last'`: the event has been triggered by the "go-to-last-move" key (aka. the end key),
	 *                        - `'click'`: the event has been triggered by a mouse click on a move.
	 */
	onMoveSelected: PropTypes.func,
};


Movetext.defaultProps = {
	game: new kokopu.Game(),
	gameIndex: 0,
	diagramOptions: {},
	pieceSymbols: 'native',
	diagramVisible: true,
	headerVisible: true,
};


/**
 * Example: `'hello world'` is turned into `'Hello world'`.
 */
function capitalizeFirstWord(text) {
	return text.length===0 ? '' : text.charAt(0).toUpperCase() + text.slice(1);
}


function formatResult(result) {
	switch (result) {
		case '1/2-1/2': return '\u00bd\u2013\u00bd';
		case '1-0': return '1\u20130';
		case '0-1': return '0\u20131';
	}
}


function createSanitizer() {
	return new HtmlSanitizer({
		allowedTags: [ 'a', 'span', 'b', 'strong', 'i', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup' ],
		allowedAttributes: {
			'*': [ 'class', 'id', 'title' ],
			'a': [ 'href', 'target' ]
		}
	});
}


function sanitizeHtml(text, sanitizer) {
	if (!sanitizer) {
		sanitizer = createSanitizer();
	}
	let result = sanitizer.parse(text);
	return result ?? text;
}


/**
 * Decompose the given string into piece symbol characters and sections of non piece symbol characters, and transform the piece symbols into
 * React objects represented with the given chess font.
 */
function figurineNotation(text, fontName) {
	let result = [];
	let beginOfText = 0;
	let pieceSymbolIndex = 0;
	for (let pos = 0; pos < text.length; ++pos) {
		let currentChar = text.charAt(pos);
		if (currentChar === 'K' || currentChar === 'Q' || currentChar === 'R' || currentChar === 'B' || currentChar === 'N' || currentChar === 'P') {
			if (pos > beginOfText) {
				result.push(text.substring(beginOfText, pos));
			}
			beginOfText = pos + 1;
			let key = 'symbol-' + (pieceSymbolIndex++);
			result.push(<span className={'kokopu-font-' + fontName} key={key}>{currentChar}</span>);
		}
	}
	if (beginOfText < text.length) {
		result.push(text.substring(beginOfText));
	}
	return result;
}


function getPreviousNodeId(currentNode) {
	let previousNode = currentNode.previous();
	if (previousNode) {
		return previousNode.id();
	}
	else {
		let parentNode = currentNode.parentVariation().parentNode();
		return parentNode ? getPreviousNodeId(parentNode) : 'start';
	}
}


function getNextNodeId(currentNode, isVariation) {
	let nextNode = isVariation ? currentNode.first() : currentNode.next();
	return nextNode ? nextNode.id() : false;
}


function getLastNodeId(currentNode, isVariation) {
	currentNode = isVariation ? currentNode.first() : currentNode.next();
	if (!currentNode) { // Ensure that the input node is not already the last one.
		return false;
	}
	while (true) {
		let nextNode = currentNode.next();
		if (!nextNode) {
			return currentNode.id();
		}
		currentNode = nextNode;
	}
}


/**
 * Try to interpret the given object as a chess game.
 */
function parseGame(game, gameIndex) {
	if (game instanceof kokopu.Game) {
		return { error: false, game: game };
	}
	else if (game instanceof kokopu.Database || typeof game === 'string') {
		try {
			let result = game instanceof kokopu.Database ? game.game(gameIndex) : kokopu.pgnRead(game, gameIndex);
			return { error: false, game: result };
		}
		catch (e) {
			// istanbul ignore else
			if (e instanceof kokopu.exception.InvalidPGN) {
				return { error: true, message: e.message, text: e.pgn, errorIndex: e.index, lineNumber: e.lineNumber };
			}
			else {
				throw e;
			}
		}
	}
	else {
		return { error: true, message: i18n.INVALID_GAME_ATTRIBUTE_ERROR_MESSAGE };
	}
}
