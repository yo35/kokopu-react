
import React from 'react';

import Square from './square';

export default class extends React.Component {

	render() {
		let rows = [...'87654321'].map(r => this.renderRow(r));
		return (
			<div className="kokopu-board kokopu-size42">
				{rows}
			</div>
		);
	}

	renderRow(r) {
		let squares = [...'abcdefgh'].map(c => this.renderSquare(r, c));
		return (
			<div key={r} className="kokopu-boardRow">
				{squares}
			</div>
		);
	}

	renderSquare(r, c) {
		let sq = c + r;
		return <Square key={c} id={sq} />;
	}

}
