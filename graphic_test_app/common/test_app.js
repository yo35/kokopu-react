/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021  Yoann Le Montagner <yo35 -at- melix.net>            *
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
 ******************************************************************************/


import React from 'react';
import ReactDOM from 'react-dom';
import './test_app.css';


function flattenMultiElements(elements) {
	let items = [];
	for (let i = 0; i < elements.length; ++i) {
		items.push(<div className="test-item" id={'test-item-' + i}>{elements[i]}</div>);
	}
	return <div>{items}</div>;
}


/**
 * Create an DIV element at the root of the current document, and render the given elements in it.
 */
export default function(elements) {

	// Create the main anchor.
	let anchor = document.createElement('div');
	anchor.id = 'test-app';
	document.body.appendChild(anchor);

	// Render the content.
	let content = Array.isArray(elements) ? flattenMultiElements(elements) : elements;
	ReactDOM.render(content, anchor);
}
