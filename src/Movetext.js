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
 * Human-readable symbols for the most common NAGs.
 */
const SPECIAL_NAGS_LOOKUP = {
	/* eslint-disable no-mixed-spaces-and-tabs */
	  3: '!!',      // very good move
	  1: '!',       // good move
	  5: '!?',      // interesting move
	  6: '?!',      // questionable move
	  2: '?',       // bad move
	  4: '??',      // very bad move
	 18: '+\u2212', // White has a decisive advantage
	 16: '\u00b1',  // White has a moderate advantage
	 14: '\u2a72',  // White has a slight advantage
	 10: '=',       // equal position
	 11: '=',       // equal position (ChessBase)
	 15: '\u2a71',  // Black has a slight advantage
	 17: '\u2213',  // Black has a moderate advantage
	 19: '\u2212+', // Black has a decisive advantage
	  7: '\u25a1',  // Only move
	  8: '\u25a1',  // Only move (ChessBase)
	 13: '\u221e',  // unclear position
	 22: '\u2a00',  // Zugzwang
	 32: '\u27f3',  // Development advantage
	 36: '\u2191',  // Initiative
	 40: '\u2192',  // Attack
	132: '\u21c6',  // Counterplay
	138: '\u2295',  // Zeitnot
	140: '\u2206',  // With idea
	142: '\u2313',  // Better is
	146: 'N',       // Novelty
	/* eslint-enable no-mixed-spaces-and-tabs */
};


/**
 * Display a chess game, i.e. the headers (name of the players, event, etc.), the moves, and all the related annotations if any (comments, variations, NAGs...).
 */
export default class Movetext extends React.Component {

	render() {
		let info = parseGame(this.props.game);
		if (info.error) {
			return <ErrorBox title={i18n.INVALID_PGN_ERROR_TITLE} message={info.message}></ErrorBox>;
		}
		let game = info.game;

		return (
			<div className="kokopu-movetext">
				{this.renderHeaders(game)}
				{this.renderBody(game)}
			</div>
		);
	}

	renderHeaders(game) {
		let headers = [];
		headers.push(this.renderPlayerHeaders(game, 'w'));
		headers.push(this.renderPlayerHeaders(game, 'b'));
		headers.push(this.renderEventRoundHeaders(game));
		headers.push(this.renderDateSiteHeaders(game));
		headers.push(this.renderAnnotatorHeader(game));
		return headers.some(element => element !== undefined) ? <div>{headers}</div> : undefined;
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
		if (variation.comment() !== undefined) {
			if(variation.isLongComment()) {
				moveGroups.push(this.renderComment(variation, true));
			}
			else {
				currentMoveGroupElements.push(this.renderComment(variation, true));
			}
		}

		// Visit all the PGN nodes (one node per move) within the variation.
		let forcePrintMoveNumber = true;
		let node = variation.first();
		while (node !== undefined) {

			// Write the move, including directly related information (i.e. move number + NAGs).
			currentMoveGroupElements.push(this.renderMove(notationTextBuilder, node, forcePrintMoveNumber));

			// Write the comment (if any).
			if (node.comment() !== undefined) {
				if (node.isLongComment()) {
					closeMoveGroup();
					moveGroups.push(this.renderComment(node, false));
				}
				else {
					currentMoveGroupElements.push(this.renderComment(node, false));
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
			forcePrintMoveNumber = (node.comment() !== undefined || hasNonEmptySubVariations);
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
		let printMoveNumber = forcePrintMoveNumber || node.moveColor() === 'w';
		let moveNumberText  = node.fullMoveNumber() + (node.moveColor() === 'w' ? '.' : '\u2026');
		let moveNumberClassNames = [ 'kokopu-moveNumber' ];
		if (!printMoveNumber) {
			moveNumberClassNames.push('kokopu-hidden');
		}

		// SAN notation.
		let notationText = notationTextBuilder(node.notation());

		// NAGs
		let nagElements = node.nags().map(nag => <span className="kokopu-nag" key={nag}>{formatNag(nag)}</span>);

		return (
			<span className="kokopu-move" key={node.fullMoveNumber() + node.moveColor()}>
				<span className={moveNumberClassNames.join(' ')}>{moveNumberText}</span>
				<span className="kokopu-moveNotation">{notationText}</span>
				{nagElements.length === 0 ? undefined : nagElements}
			</span>
		);
	}

	/**
	 * Render the given text comment with its diagrams, if any.
	 */
	renderComment(node, isVariation) {
		let comment = node.comment();
		let content;
		if (comment.includes('[#]')) {
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
	 * or a [PGN string](https://en.wikipedia.org/wiki/Portable_Game_Notation).
	 */
	game: PropTypes.oneOfType([
		PropTypes.instanceOf(kokopu.Game),
		PropTypes.string
	]),

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
};


Movetext.defaultProps = {
	game: new kokopu.Game(),
	diagramOptions: {},
	pieceSymbols: 'native',
};


/**
 * Example: `'hello world'` is turned into `'Hello world'`.
 */
function capitalizeFirstWord(text) {
	return text.length===0 ? '' : text.charAt(0).toUpperCase() + text.slice(1);
}


function formatNag(nag) {
	return nag in SPECIAL_NAGS_LOOKUP ? SPECIAL_NAGS_LOOKUP[nag] : '$' + nag;
}


function formatResult(result) {
	switch (result) {
		case '1/2-1/2': return '\u00bd\u2013\u00bd';
		case '1-0'    : return '1\u20130';
		case '0-1'    : return '0\u20131';
		default: return result;
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


/**
 * Try to interpret the given object as a chess game.
 */
function parseGame(game) {
	if (game instanceof kokopu.Game) {
		return { error: false, game: game };
	}
	else if (typeof game === 'string') {
		try {
			return { error: false, game: kokopu.pgnRead(game, 0) }; // TODO allow index customization
		}
		catch (e) {
			// istanbul ignore else
			if (e instanceof kokopu.exception.InvalidPGN) {
				return { error: true, message: e.message }; // TODO report + display line number
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
