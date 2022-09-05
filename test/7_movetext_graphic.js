/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2022  Yoann Le Montagner <yo35 -at- melix.net>       *
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


const { openBrowser, closeBrowser, itChecksScreenshots } = require('./common/graphic');


describe('Movetext graphic', function() {

	const browserContext = {};

	before(async function() {
		await openBrowser(this, browserContext);
	});

	after(async function() {
		await closeBrowser(browserContext);
	});

	itChecksScreenshots(browserContext, '13_movetext_simple', [ 'game-0', 'game-1', 'game-2', 'game-3' ]);
	itChecksScreenshots(browserContext, '14_movetext_error', [ 'wrong-game-index-1', 'wrong-game-index-2', 'pgn-parsing-error-1', 'pgn-parsing-error-2', 'wrong type' ]);
	itChecksScreenshots(browserContext, '15_movetext_html', [ 'html-in-headers', 'html-in-comments', 'filtered-tags-and-attributes' ]);
	itChecksScreenshots(browserContext, '16_movetext_options', [ 'localized-piece-symbols', 'custom-piece-symbols', 'figurine-piece-symbols-and-diagram-options',
		'hidden-diagrams' ]);
});
