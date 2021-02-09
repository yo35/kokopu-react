
import React from 'react';

import Square from './square';

export default class extends React.Component {

	render() {
		let rows = [...'87654321'].map(r => this.renderRow(r));
		let columnCoordinates = [...'abcdefgh'].map(c => this.renderColumnCoordinate(c));
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

	renderRow(r) {
		let squares = [...'abcdefgh'].map(c => this.renderSquare(r, c));
		return (
			<div key={r} className="kokopu-boardRow">
				<div className="kokopu-boardCell kokopu-rowCoordinate">{r}</div>
				{squares}
			</div>
		);
	}

	renderSquare(r, c) {
		let sq = c + r;
		return <Square key={c} id={sq} />;
	}

	renderColumnCoordinate(c) {
		return <div key={c} className="kokopu-boardCell kokopu-columnCoordinate">{c}</div>;
	}

}
