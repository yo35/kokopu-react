
import React from 'react';
import ReactDOM from 'react-dom';
import kokopu from 'kokopu';

import './chessboard.css';
import Board from './board';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			position: new kokopu.Position(),
			isFlipped: false,
		};
	}

	render() {
		return (
			<div>
				<button onClick={() => this.handlePositionClicked(new kokopu.Position('empty'))}>Empty position</button>
				<button onClick={() => this.handlePositionClicked(new kokopu.Position())}>Start position</button>
				<button onClick={() => this.handlePositionClicked('8/8/8/8/8/4k3/q7/4K3 b - - 0 1')}>Custom position</button>
				<button onClick={() => this.handlePositionClicked('8/k1b/8/8/8/4k3/q7/4K3 b - - 0 1')}>Bad FEN</button>
				<button onClick={() => this.handleFlipClicked()}>Flip</button>
				<Board position={this.state.position} isFlipped={this.state.isFlipped}/>
			</div>
		);
	}

	handlePositionClicked(newPosition) {
		let newState = this.cloneState();
		newState.position = newPosition;
		this.setState(newState);
	}

	handleFlipClicked() {
		let newState = this.cloneState();
		newState.isFlipped = !this.state.isFlipped;
		this.setState(newState);
	}

	cloneState() {
		return {
			position: this.state.position,
			isFlipped: this.state.isFlipped,
		};
	}
}

const appRoot = document.createElement('div');
document.body.appendChild(appRoot);

ReactDOM.render(<App />, appRoot);
