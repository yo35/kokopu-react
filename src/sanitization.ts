/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2024  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    Kokopu-React is free software: you can redistribute it and/or           *
 *    modify it under the terms of the GNU Lesser General Public License      *
 *    as published by the Free Software Foundation, either version 3 of       *
 *    the License, or (at your option) any later version.                     *
 *                                                                            *
 *    Kokopu-React is distributed in the hope that it will be useful,         *
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


export function sanitizePartialObject<T>(input: Partial<T> | undefined, exceptionBuilder: () => IllegalArgument): Partial<T> {
	if (input === undefined || input === null) {
		return {};
	}
	else if (typeof input !== 'object') {
		throw exceptionBuilder();
	}
	else {
		return input;
	}
}


export function sanitizeInteger(input: number, exceptionBuilder: () => IllegalArgument): number {
	if (typeof input !== 'number' || !Number.isFinite(input)) {
		throw exceptionBuilder();
	}
	return Math.round(input);
}


export function sanitizeBoundedInteger(input: number, min: number, max: number, exceptionBuilder: () => IllegalArgument) {
	return Math.min(Math.max(sanitizeInteger(input, exceptionBuilder), min), max);
}


export function sanitizeOptional<T>(input: T | undefined, sanitizationFunction: (val: T) => T): T | undefined {
	return input === undefined || input === null ? undefined : sanitizationFunction(input);
}
