/* -------------------------------------------------------------------------- *
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2023  Yoann Le Montagner <yo35 -at- melix.net>       *
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
import { ErrorBox } from '../../../dist/lib/index';

testApp([ /* eslint-disable react/jsx-key */

	<ErrorBox title="I'm the title" message="I'm the message" />,
	<ErrorBox title="The title" message="Keep both the beginning and the end" text="| Error: x <- is here" errorIndex={9} lineNumber={1} />,

	<ErrorBox title="No error index" message="Nothing below" text="You will not see this..." />,
	<ErrorBox title="No error text" message="Nothing below" errorIndex={1} />,
	<ErrorBox title="Negative error index" message="Nothing below" text="You will not see this..." errorIndex={-1} />,
	<ErrorBox title="Too large error index" message="Nothing below" text="You will not see this..." errorIndex={100} />,
	<ErrorBox title="Error index not an integer" message="Nothing below" text="You will not see this..." errorIndex={2.3} />,

	<ErrorBox title="Cut the end of the text" message="and keep all the beginning" text="| x <- the error is there and the rest of the line is cut because too long"
		errorIndex={2} />,
	<ErrorBox title="Cut the beginning of the text" message="and keep all the end" text="The error is there -> x 234567890 234567890 234567890 234567890"
		errorIndex={22} lineNumber={0} />,
	<ErrorBox title="Cut on line breaks" message="both at the beginning and at the end" text={'This is the first line\n| x |\nThis is the third line'}
		errorIndex={25} lineNumber={2} />,
	<ErrorBox title="Single character text" message="The text is 1-character long" text="x" errorIndex={0} lineNumber={1.1} />,

]); /* eslint-enable react/jsx-key */
