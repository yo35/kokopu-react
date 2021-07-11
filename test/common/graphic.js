/******************************************************************************
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021  Yoann Le Montagner <yo35 -at- melix.net>            *
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


const fs = require('fs');
const { Builder, By, Capabilities } = require('selenium-webdriver');
const { imgDiff } = require('img-diff-js');
const test = require('unit.js');

const rootDir = __dirname + '/../..';
const referenceDir = rootDir + '/test/references';
const outputDir = rootDir + '/build/graphic_output';


/**
 * Open a browser in the client (+ ensure everything else is ready to execute graphic tests).
 */
exports.openBrowser = async function(mochaContext) {

	// The initialization process may take a while, thus increase the timeout threshold.
	mochaContext.timeout(10000);

	// Ensure that the output directory (i.e. where the screenshots are generated) do exist.
	fs.mkdirSync(outputDir, { recursive: true });

	// Start the browser and ensure it can fetch something.
	let capabilities = Capabilities.firefox();
	let driver = new Builder().usingServer('http://localhost:4444').withCapabilities(capabilities).build();
	await driver.get('file:///app/build/test_graphic/healthcheck.txt');
	return driver;
};


/**
 * Close the given browser.
 */
exports.closeBrowser = async function(driver) {
	await driver.quit();
};


/**
 * Open the page corresponding to the given test-case, take a screenshot, and compare it to the reference.
 */
exports.checkScreenshot = async function(driver, testCaseName) {

	let actualFilename = `${outputDir}/${testCaseName}.png`;
	let expectedFilename = `${referenceDir}/${testCaseName}.png`;
	let differenceFilename = `${outputDir}/${testCaseName}.diff.png`;

	// Take a screenshot of the browser content corresponding to the given test-case.
	await driver.get(`file:///app/build/test_graphic/${testCaseName}/index.html`);
	let image = await driver.findElement(By.css('#test-app')).takeScreenshot();
	fs.writeFileSync(actualFilename, image, 'base64');

	// Compare the current screenshot to the reference.
	let result = await imgDiff({
		actualFilename: actualFilename,
		expectedFilename: expectedFilename,
		diffFilename: differenceFilename,
	});
	test.object(result).hasProperty('imagesAreSame', true);
};
