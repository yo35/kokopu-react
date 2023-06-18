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


const { describeWithBrowser, itChecksScreenshots } = require('./common/graphic');


describeWithBrowser('Movetext graphic', browserContext => {

	itChecksScreenshots(browserContext, '10_movetext_graphic/base', [
		'game 1',
		'game 2',
		'game 3',
		'game 4',
	]);

	itChecksScreenshots(browserContext, '10_movetext_graphic/error', [
		'wrong game index 1',
		'wrong game index 2',
		'pgn parsing error 1',
		'pgn parsing error 2',
		'wrong game type',
		'wrong game index type',
	]);

	itChecksScreenshots(browserContext, '10_movetext_graphic/html', [
		'html in headers',
		'html in comments',
		'filtered tags and attributes',
	]);

	itChecksScreenshots(browserContext, '10_movetext_graphic/options', [
		'localized piece symbols',
		'custom piece symbols',
		'figurine piece symbols and diagram options',
		'other diagram options',
		'hidden diagrams',
		'wrong diagram options 1',
		'wrong diagram options 2',
	]);

});
