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


/**
 * This module contains the exceptions used by the library.
 * @module
 */


/**
 * Exception thrown when an invalid argument is passed to a function or a component.
 */
export class IllegalArgument {

	/** Name of the function or component that raises the exception. */
	functionOrComponentName: string;

	/** Name of the argument that causes the error. */
	argumentName: string;

	constructor(functionOrComponentName: string, argumentName: string) {
		this.functionOrComponentName = functionOrComponentName;
		this.argumentName = argumentName;
	}

	/**
	 * @ignore
	 */
	toString(): string {
		return `Illegal argument '${this.argumentName}' in function or component ${this.functionOrComponentName}`;
	}
}
