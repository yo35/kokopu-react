
import React from 'react';

import './error_box.css';

export default function(props) {
	let message = 'message' in props ? <div className="kokopu-errorMessage">{props.message}</div> : <></>;
	return (
		<div className="kokopu-errorBox">
			<div className="kokopu-errorTitle">{props.title}</div>
			{message}
		</div>
	);
}
