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


import { IllegalArgument } from './exception';


export function sanitizeString(input: string): string {
	return String(input);
}


export function sanitizeBoolean(input: boolean): boolean {
	return Boolean(input);
}


export function sanitizeInteger(input: number, exceptionBuilder: () => IllegalArgument): number {
	const val = Math.round(Number(input));
	if (!Number.isInteger(val)) {
		throw exceptionBuilder;
	}
	return val;
}


export function sanitizeBoundedInteger(input: number, min: number, max: number, exceptionBuilder: () => IllegalArgument) {
	return Math.min(Math.max(sanitizeInteger(input, exceptionBuilder), min), max);
}


export function sanitizeOptional<T>(input: T | undefined, sanitizationFunction: (val: T) => T): T | undefined {
	return input === undefined || input === null ? undefined : sanitizationFunction(input);
}
