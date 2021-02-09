
import React from 'react';
import kokopu from 'kokopu';

export default function(props) {
	let colorClassName = kokopu.squareColor(props.id) === 'w' ? 'kokopu-lightSquare' : 'kokopu-darkSquare';
	return (
		<div className={['kokopu-square', 'kokopu-sized', colorClassName].join(' ')}>
		</div>
	);
}
