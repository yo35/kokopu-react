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
const path = require('path');
const { Builder, By, Capabilities } = require('selenium-webdriver');
const { imgDiff } = require('img-diff-js');
const test = require('unit.js');

const rootDir = __dirname + '/../..';
const referenceDir = rootDir + '/test/references';
const outputDir = rootDir + '/build/graphic_output';

const UNREACHABLE_TEST_CLIENT_MESSAGE =
	'Cannot reach the dockerized selenium webbrowser used for graphic tests (probably because the test environment is not running).\n' +
	'\n' +
	'Use command `npm run start_test_env` to start the test environment.\n' +
	'Do not forget to run `npm run stop_test_env` when finished.\n';


/**
 * Open a browser in the client (+ ensure everything else is ready to execute graphic tests).
 */
exports.openBrowser = async function(mochaContext, browserContext) {

	// The initialization process may take a while, thus increase the timeout threshold.
	mochaContext.timeout(10000);

	// Start the browser and ensure it can fetch something.
	let capabilities = Capabilities.firefox();
	let driver = new Builder().usingServer('http://localhost:4444').withCapabilities(capabilities).build();
	await driver.get('file:///app/build/test_graphic/healthcheck.txt').catch(reason => {
		return Promise.reject(reason.message.includes('ECONNREFUSED') ? new Error(UNREACHABLE_TEST_CLIENT_MESSAGE) : reason);
	});

	// Initialize the browser context
	browserContext.driver = driver;
	browserContext.latestTestCase = '';
};


/**
 * Close the given browser.
 */
exports.closeBrowser = async function(browserContext) {
	if (browserContext.driver) {
		await browserContext.driver.quit();
		delete browserContext.driver;
		delete browserContext.latestTestCase;
	}
};


/**
 * Open the page corresponding to the given test-case.
 */
async function fetchTestCase(browserContext, testCaseName) {
	if (browserContext.latestTestCase === testCaseName) {
		return;
	}
	await browserContext.driver.get(`file:///app/build/test_graphic/${testCaseName}/index.html`);
	browserContext.latestTestCase = testCaseName;
}


/**
 * Take a screenshot of the element identified by the given CSS target, and compare it to the reference.
 */
async function takeScreenshotAndCompare(browserContext, imageBaseName, cssTarget) {

	let actualFilename = `${outputDir}/${imageBaseName}.png`;
	let expectedFilename = `${referenceDir}/${imageBaseName}.png`;
	let differenceFilename = `${outputDir}/${imageBaseName}.diff.png`;

	// Take a screenshot of the targeted element.
	let image = await browserContext.driver.findElement(By.css(cssTarget)).takeScreenshot();
	fs.mkdirSync(path.dirname(actualFilename), { recursive: true });
	fs.writeFileSync(actualFilename, image, 'base64');

	// Compare the current screenshot to the reference.
	let result = await imgDiff({
		actualFilename: actualFilename,
		expectedFilename: expectedFilename,
		diffFilename: differenceFilename,
	});
	test.object(result).hasProperty('imagesAreSame', true);
}


/**
 * Open the page corresponding to the given test-case, take a screenshot, and compare it to the reference.
 */
exports.itChecksScreenshot = function(browserContext, testCaseName) {
	it(testCaseName, async function() {
		await fetchTestCase(browserContext, testCaseName);
		await takeScreenshotAndCompare(browserContext, testCaseName, '#test-app');
	});
};


/**
 * Open the page corresponding to the given test-case, take a screenshot for each item, and compare them to the reference.
 */
exports.itChecksScreenshots = function(browserContext, testCaseName, itemNames) {
	for (let i = 0; i < itemNames.length; ++i) {
		it(`${testCaseName} - Item ${i} (${itemNames[i]})`, async function() {
			await fetchTestCase(browserContext, testCaseName);
			await takeScreenshotAndCompare(browserContext, testCaseName + '/' + i, '#test-item-' + i);
		});
	}
};
