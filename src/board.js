
import React from 'react';
import kokopu from 'kokopu';

import Square from './square';

export default class extends React.Component {

	render() {
		let position = parsePosition(this.props.position);
		if(position === null) {
			return <></>;
		}

		let rows = this.getRowIds().map(r => this.renderRow(position, r));
		let columnCoordinates = this.getColumnIds().map(c => this.renderColumnCoordinate(c));
		return (
			<div className="kokopu-board kokopu-size42">
				{rows}
				<div className="kokopu-boardRow kokopu-columnCoordinates">
					<div className="kokopu-boardCell"></div>
					{columnCoordinates}
				</div>
			</div>
		);
	}

	renderRow(position, r) {
		let squares = this.getColumnIds().map(c => this.renderSquare(position, r, c));
		return (
			<div key={r} className="kokopu-boardRow">
				<div className="kokopu-boardCell kokopu-rowCoordinate">{r}</div>
				{squares}
			</div>
		);
	}

	renderSquare(position, r, c) {
		let sq = c + r;
		return <Square key={sq} color={kokopu.squareColor(sq)} cp={position.square(sq)} />;
	}

	renderColumnCoordinate(c) {
		return <div key={c} className="kokopu-boardCell kokopu-columnCoordinate">{c}</div>;
	}

	getRowIds() {
		return [...(this.props.isFlipped ? '12345678' : '87654321')];
	}

	getColumnIds() {
		return [...(this.props.isFlipped ? 'hgfedcba' : 'abcdefgh')];
	}
}

/**
 * Try to interpret the given object as a chess position.
 *
 * @param {*} position
 * @returns {?kokopu.Position}
 */
function parsePosition(position) {
	if(position instanceof kokopu.Position) {
		return position;
	}
	else if(typeof position === 'string') {
		try {
			return new kokopu.Position(position);
		}
		catch(e) {
			if(e instanceof kokopu.exception.InvalidFEN) {
				// TODO handle error
				return null;
			}
			else {
				throw e;
			}
		}
	}
	else {
		return null;
	}
}
