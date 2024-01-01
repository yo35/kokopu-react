/* -------------------------------------------------------------------------- *
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2024  Yoann Le Montagner <yo35 -at- melix.net>       *
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
 * -------------------------------------------------------------------------- */


import * as React from 'react';
import { testApp } from '../common/test_app';
import { Chessboard } from '../../../dist/lib/index';

function TestComponent() {

	const [ clicked, setClicked ] = React.useState(false);
	const position = clicked ? 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1' : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	const move = clicked ? 'Nf6' : 'e4';

	function onClick() {
		window['__kokopu_debug_freeze_motion'] = 0.6;
		setClicked(true);
	}

	return (<>
		<div>
			<Chessboard position={position} move={move} animated={true} />
		</div>
		{clicked ? undefined : <button id="chessboard-action-button" onClick={onClick}>Click here</button>}
	</>);
}


testApp([ /* eslint-disable react/jsx-key */
	<TestComponent />,
]); /* eslint-enable react/jsx-key */
