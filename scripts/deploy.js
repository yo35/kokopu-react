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


'use strict';

const readline = require('readline');
const Client = require('ssh2-sftp-client');

function promptPassword(prompt, callback) {

	let rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	rl.input.on("keypress", () => {
		let len = rl.line.length;
		readline.moveCursor(rl.output, -len, 0);
		readline.clearLine(rl.output, 1);
		rl.output.write('*'.repeat(len));
	});

	let password = '';
	rl.on('close', () => callback(password));

	rl.question(prompt, answer => {
		password = answer;
		rl.close();
	});
}


const HOST = 'ftp.cluster007.ovh.net';
const USER = 'yolgiypr';
const ROOT_DIR = 'kokopu-react';

promptPassword(`Pass for ${USER}@${HOST}: `, pass => {

	// Validate the password.
	if (!pass) {
		console.log('Deploy canceled.');
		return;
	}

	let client = new Client();
	client.connect({
		host: HOST,
		username: USER,
		password: pass,
	}).then(function() {

		// Upload the documentation.
		console.log('Upload documentation...');
		return client.uploadDir('dist/docs', `${ROOT_DIR}/docs`);

	}).then(() => console.log('Done.')).catch(() => console.log(err)).finally(() => client.end());
});
