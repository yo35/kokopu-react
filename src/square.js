
import React from 'react';

export default function(props) {
	let colorClassName = props.color === 'w' ? 'kokopu-lightSquare' : 'kokopu-darkSquare';
	let squareContent = props.cp === '-' ? <></> : renderColoredPiece(props.cp);
	return (
		<div className={['kokopu-boardCell', 'kokopu-square', 'kokopu-sized', colorClassName].join(' ')}>
			{squareContent}
		</div>
	);
}

function renderColoredPiece(coloredPiece) {
	let coloredPieceClassName = 'kokopu-piece-' + coloredPiece;
	return <div className={['kokopu-piece', 'kokopu-sized', coloredPieceClassName].join(' ')}></div>;
}
