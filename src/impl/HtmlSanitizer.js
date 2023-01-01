/******************************************************************************
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
 ******************************************************************************/


import React from 'react';
import * as htmlparser2 from 'htmlparser2';


/**
 * Those tags cannot have any children.
 */
const NO_CHILDREN_TAGS = new Set([ 'br', 'hr', 'img' ]);


/**
 * HTML sanitizer: parse HTML string, keeping only the allowed HTML nodes, and the corresponding React object.
 */
export default class HtmlSanitizer {

	constructor({ allowedTags, allowedAttributes }) {
		this._allowedTags = allowedTags ? new Set(allowedTags) : new Set();
		this._allowedAttributes = allowedAttributes ? new Map(Object.entries(allowedAttributes).map(([k, v]) => [k, new Set(v)])) : new Map();
		this._keyCounter = 0;
	}

	/**
	 * @param {string} text HTML string to be parsed.
	 * @returns {*} React object corresponding to the given HTML string. Can also be a fragment, or just a simple string if the given HTML string
	 *          does not contain any HTML tag.
	 */
	parse(text) {
		let dom = htmlparser2.parseDocument(text);

		// Ensure that the returned object is a non-empty node type.
		if (dom.type !== 'root') {
			return undefined;
		}

		// Process the children of the root node.
		let result = [];
		dom.children.forEach(child => {
			let childElement = this._processNode(child);
			if (childElement) {
				result.push(childElement);
			}
		});

		// Return the result.
		if (result.length === 0) {
			return undefined;
		}
		else if (result.length === 1) {
			return result[0];
		}
		else {
			return <React.Fragment key={this._allocateKey()}>{result}</React.Fragment>;
		}
	}

	_processNode(node) {
		if (node.type === 'text') {
			return node.data;
		}
		else if (node.type === 'tag') {
			let children = NO_CHILDREN_TAGS.has(node.name) ? undefined : node.children.map(child => this._processNode(child));
			if (this._allowedTags.has(node.name)) {
				let attributes = this._filterAttributes(node.name, node.attribs);
				attributes['key'] = this._allocateKey();
				return React.createElement(node.name, attributes, children);
			}
			else {
				return children ? <React.Fragment key={this._allocateKey()}>{children}</React.Fragment> : undefined;
			}
		}
		else {
			return undefined;
		}
	}

	_filterAttributes(nodeName, attributes) {
		let result = {};
		for (let [attribute, value] of Object.entries(attributes)) {
			if (this._isAttributeAllowed(nodeName, attribute)) {
				result[attribute === 'class' ? 'className' : attribute] = value;
			}
		}
		return result;
	}

	_isAttributeAllowed(nodeName, attribute) {
		if (attribute === 'key' && attribute === 'ref' && attribute === 'className') { // Those attributes are always forbidden.
			return false;
		}
		let allowedAttributesForCurrent = this._allowedAttributes.get(nodeName);
		if (allowedAttributesForCurrent && allowedAttributesForCurrent.has(attribute)) {
			return true;
		}
		let allowedAttributesForAll = this._allowedAttributes.get('*');
		if (allowedAttributesForAll && allowedAttributesForAll.has(attribute)) {
			return true;
		}
		return false;
	}

	_allocateKey() {
		return 'auto-' + (this._keyCounter++);
	}
}
