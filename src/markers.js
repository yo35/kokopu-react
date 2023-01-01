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


import { isValidSquare, isValidVector, isValidColor, isValidSymbol } from './impl/util';


/**
 * Transform a set of square markers defined as a "square -> color" struct into a comma-separated string.
 *
 * @param {object} markers For example: `{ e4: 'g', d5: 'r' }`
 * @returns {string} For example: `'Gd5,Ge4'`
 */
export function flattenSquareMarkers(markers) {
	return Object.entries(markers)
		.filter(([ sq, color ]) => isValidSquare(sq) && isValidColor(color))
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([ sq, color ]) => color.toUpperCase() + sq)
		.join(',');
}


/**
 * Transform a set of text markers defined as a "square -> (symbol, color)" struct into a comma-separated string.
 *
 * @param {object} markers For example: `{ e4: { symbol: 'A', color: 'g' }, d5: { symbol: 'z', color: 'r' }, h3: { symbol: 'plus', color: 'y' } }`
 * @returns {string} For example: `'Rzd5,GAe4,Y(plus)h3'`
 */
export function flattenTextMarkers(markers) {
	return Object.entries(markers)
		.filter(([ sq, desc ]) => isValidSquare(sq) && desc && isValidColor(desc.color) && isValidSymbol(desc.symbol))
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([ sq, desc ]) => desc.color.toUpperCase() + (desc.symbol.length === 1 ? desc.symbol : '(' + desc.symbol + ')') + sq)
		.join(',');
}


/**
 * Transform a set of arrow markers defined as a "squareFromSquareTo -> color" struct into a comma-separated string.
 *
 * @param {object} markers For example: `{ e2e4: 'g', g8f6: 'r', g8h6: 'b' }`
 * @returns {string} For example: `'Ge2e4,Rg8f6,Bg8h6'`
 */
export function flattenArrowMarkers(markers) {
	return Object.entries(markers)
		.filter(([ vect, color ]) => isValidVector(vect) && isValidColor(color))
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([ vect, color ]) => color.toUpperCase() + vect)
		.join(',');
}


function parseMarkers(markers, tokenParser) {
	let result = {};
	markers.split(',').map(token => tokenParser(token.trim())).filter(marker => marker).forEach(({ key, value }) => { result[key] = value; });
	return result;
}


/**
 * Parse a set of square markers defined as a comma-separated string into a "square -> color" struct.
 *
 * @param {string} markers For example: `'Gd5,Ge4'`
 * @returns {object} For example: `{ e4: 'g', d5: 'r' }`
 */
export function parseSquareMarkers(markers) {
	return parseMarkers(markers, token => {
		return /^([BGRY])([a-h][1-8])$/.test(token) ? { key: RegExp.$2, value: RegExp.$1.toLowerCase() } : undefined;
	});
}


/**
 * Parse a set of text markers defined as a comma-separated string into a "square -> (symbol, color)" struct.
 *
 * @param {string} markers For example: `'Rzd5,GAe4,Y(plus)h3'`
 * @returns {object} For example: `{ e4: { symbol: 'A', color: 'g' }, d5: { symbol: 'z', color: 'r' }, h3: { symbol: 'plus', color: 'y' } }`
 */
export function parseTextMarkers(markers) {
	return parseMarkers(markers, token => {
		return /^([BGRY])(?:([A-Za-z0-9])|\((plus|times|dot|circle)\))([a-h][1-8])$/.test(token) ?
			{ key: RegExp.$4, value: { symbol: RegExp.$2 || RegExp.$3, color: RegExp.$1.toLowerCase() } } : undefined;
	});
}


/**
 * Parse a set of arrow markers defined as a comma-separated string into a "squareFromSquareTo -> color" struct.
 *
 * @param {string} markers For example: `'Ge2e4,Rg8f6,Bg8h6'`
 * @returns {object} For example: `{ e2e4: 'g', g8f6: 'r', g8h6: 'b' }`
 */
export function parseArrowMarkers(markers) {
	return parseMarkers(markers, token => {
		return /^([BGRY])([a-h][1-8][a-h][1-8])$/.test(token) ? { key: RegExp.$2, value: RegExp.$1.toLowerCase() } : undefined;
	});
}
