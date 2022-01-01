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


var prompt = require('prompt');
var Client = require('ssh2-sftp-client');

prompt.start();
prompt.get({ name: 'password', hidden: true, replace: '*' }, function(err, result) {

	// Validate the password.
	if (err) {
		console.log(err);
		return;
	}
	else if (result.password === '') {
		console.log('Deploy canceled.');
		return;
	}

	var client = new Client();
	client.connect({
		host: 'ftp.cluster007.ovh.net',
		username: 'yolgiypr',
		password: result.password
	}).then(function() {

		// Upload the documentation.
		console.log('Upload documentation...');
		return client.uploadDir('dist/docs', 'kokopu-react/docs');

	}).then(function() {
		console.log('Done.');
	}).catch(function(err) {
		console.log(err);
	}).finally(function() {
		return client.end();
	});
});
