
import React from 'react';
import kokopu from 'kokopu';

import ErrorBox from './error_box';
import Square from './square';

export default class extends React.Component {

	render() {
		let parseInfo = parsePosition(this.props.position);
		if(parseInfo.error) {
			return this.renderError(parseInfo.message);
		}

		let position = parseInfo.position;
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

	renderError(message) {
		return <ErrorBox title="Error while analysing a FEN string." message={message}></ErrorBox>
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
 * @returns {({error:false, position:kokopu.Position}|{error:true, message:string})}
 */
function parsePosition(position) {
	if(position instanceof kokopu.Position) {
		return {
			error: false,
			position: position
		};
	}
	else {
		try {
			return {
				error: false,
				position: new kokopu.Position(position)
			};
		}
		catch(e) {
			if(e instanceof kokopu.exception.InvalidFEN) {
				return {
					error: true,
					message: e.message
				};
			}
			else {
				throw e;
			}
		}
	}
}
