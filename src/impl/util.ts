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


export const MIN_SQUARE_SIZE = 12;
export const MAX_SQUARE_SIZE = 96;


export function generateRandomId() {
	const buffer = new Uint32Array(8);
	crypto.getRandomValues(buffer);
	let result = '';
	for (let i = 0; i < buffer.length; ++i) {
		result += buffer[i].toString(16);
	}
	return result;
}


export function fillPlaceholder(message: string, ...placeholderValues: unknown[]) {
	return message.replace(/{(\d+)}/g, (match, placeholder) => {
		const placeholderIndex = Number(placeholder);
		return placeholderIndex < placeholderValues.length ? String(placeholderValues[placeholderIndex]) : match;
	});
}


export function sanitizeInteger(input: number, min: number, max: number) {
	return Math.min(Math.max(Math.round(input), min), max);
}


export function isValidSquare(sq: string) {
	return /^[a-h][1-8]$/.test(sq);
}


export function isValidVector(vect: string) {
	return /^[a-h][1-8][a-h][1-8]$/.test(vect);
}


export function isValidColor(color: string) {
	return color === 'b' || color === 'g' || color === 'r' || color === 'y';
}


export function isValidSymbol(symbol: string) {
	return /^(?:[A-Za-z0-9]|plus|times|dot|circle)$/.test(symbol);
}
