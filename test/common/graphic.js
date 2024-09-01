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


const fs = require('fs');
const path = require('path');
const { Builder, By, Capabilities } = require('selenium-webdriver');
const { imgDiff } = require('img-diff-js');
const test = require('unit.js');

const rootDir = __dirname + '/../..';
const referenceDir = rootDir + '/test/graphic_references';
const outputDir = rootDir + '/build/graphic_output';
const coverageDir = rootDir + '/build/.nyc_output';

const UNREACHABLE_TEST_CLIENT_MESSAGE =
    'Cannot reach the Dockerized Selenium webbrowser used for graphic tests (probably because the test environment is not running).\n' +
    '\n' +
    'Use command `npm run test_env:start` to start the test environment.\n' +
    'Do not forget to run `npm run test_env:stop` when finished.\n';


const ANIMATION_DELAY = 200;
const AUTOPLAY_DELAY = 1000;


/**
 * Create a Mocha test-suite that runs graphic tests in Dockerized Selenium webbrowser.
 */
exports.describeWithBrowser = function (suiteLabel, testFactory) {
    describe(suiteLabel, function () {

        // Fetching a new page in the browser may take a while, thus increase the timeout threshold.
        this.timeout(10000);

        // Configure the browser context.
        const browserContext = {};

        before(async () => {
            await openBrowser(browserContext);
        });

        after(async () => {
            await closeBrowser(browserContext);
        });

        // Register the tests.
        testFactory(browserContext);
    });
};


/**
 * Open a browser in the client.
 */
async function openBrowser(browserContext) {

    // Start the browser and ensure it can fetch something.
    const capabilities = Capabilities.firefox();
    const driver = new Builder().usingServer('http://localhost:4444').withCapabilities(capabilities).build();
    await driver.get('file:///app/build/test_graphic/heartbeat.txt').catch(reason => {
        return Promise.reject(reason.message.includes('ECONNREFUSED') ? new Error(UNREACHABLE_TEST_CLIENT_MESSAGE) : reason);
    });

    // Initialize the browser context
    browserContext.driver = driver;
}


/**
 * Close the given browser.
 */
async function closeBrowser(browserContext) {
    if (browserContext.driver) {

        // Save the coverage data before closing the browser.
        await saveCoverage(browserContext);

        // Close the browser and clean its context.
        await browserContext.driver.quit();
        delete browserContext.driver;
        delete browserContext.latestTestCase;
    }
}


/**
 * Save the coverage data, if any.
 */
async function saveCoverage(browserContext) {
    if (!browserContext.latestTestCase) {
        return;
    }

    // Allocate a filename to save the coverage data.
    let pageIndex = 0;
    let coverageFile = '';
    do {
        coverageFile = `${coverageDir}/${browserContext.latestTestCase.replaceAll('/', '__')}-${pageIndex}.json`;
        ++pageIndex;
    } while (fs.existsSync(coverageFile));

    // Retrieve and save the coverage data.
    const coverageData = await browserContext.driver.executeScript('return JSON.stringify(window.__coverage__)');
    fs.writeFileSync(coverageFile, coverageData);
}


/**
 * Open the page corresponding to the given test-case.
 */
async function fetchTestCase(browserContext, testCaseName) {
    if (browserContext.latestTestCase === testCaseName) {
        return;
    }

    // Save coverage data before changing the page.
    await saveCoverage(browserContext);

    // Fetch the new page.
    await browserContext.driver.get(`file:///app/build/test_graphic/${testCaseName}/index.html`);
    browserContext.latestTestCase = testCaseName;
    await waitForAnimation();
}


/**
 * Wait until the end of the chessboard animations.
 */
const waitForAnimation = exports.waitForAnimation = async function () {
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DELAY));
};


/**
 * Wait until the given number of moves have been auto-played.
 */
exports.waitForAutoplay = async function (nbMoves) {
    await new Promise(resolve => setTimeout(resolve, (nbMoves + 0.5) * AUTOPLAY_DELAY));
};


/**
 * Take a screenshot of the element identified by the given CSS target.
 */
const takeScreenshot = exports.takeScreenshot = async function (browserContext, imageBaseName, element) {

    imageBaseName = imageBaseName.replaceAll(' ', '_').toLowerCase();
    const actualFilename = `${outputDir}/${browserContext.latestTestCase}/${imageBaseName}.png`;

    // Take a screenshot of the targeted element.
    const image = await element.takeScreenshot();
    fs.mkdirSync(path.dirname(actualFilename), { recursive: true });
    fs.writeFileSync(actualFilename, image, 'base64');
};


/**
 * Compare a screenshot to its reference.
 */
const compareScreenshot = exports.compareScreenshot = async function (browserContext, imageBaseName) {

    imageBaseName = imageBaseName.replaceAll(' ', '_').toLowerCase();
    const actualFilename = `${outputDir}/${browserContext.latestTestCase}/${imageBaseName}.png`;
    const expectedFilename = `${referenceDir}/${browserContext.latestTestCase}/${imageBaseName}.png`;
    const differenceFilename = `${outputDir}/${browserContext.latestTestCase}/${imageBaseName}.diff.png`;

    // Compare the current screenshot to the reference.
    const result = await imgDiff({
        actualFilename: actualFilename,
        expectedFilename: expectedFilename,
        diffFilename: differenceFilename,
    });
    test.object(result).hasProperty('imagesAreSame', true);
};


/**
 * Compare content of the sandbox to the expected text.
 */
exports.compareSandbox = async function (browserContext, expectedText) {
    const actualText = await browserContext.driver.findElement(By.id('sandbox')).getText();
    test.value(actualText).is(expectedText);
};


/**
 * Set the content of the sandbox to the given value.
 */
exports.setSandbox = async function (browserContext, value) {
    if (/[^\w \-=]/.test(value)) {
        throw new Error('Invalid characters found in the sandox message.');
    }
    await browserContext.driver.executeScript(`document.getElementById("sandbox").innerText = "${value}"`);
};


/**
 * Set the width of the browser.
 */
exports.setWindowWidth = async function (browserContext, width) {
    const { height } = await await browserContext.driver.manage().window().getRect();
    await browserContext.driver.manage().window().setRect({ width: width, height: height });
};


/**
 * Open the page corresponding to the given test-case, and execute the given scenario.
 */
const itCustom = exports.itCustom = function (browserContext, testCaseName, itemIndex, itemName, scenario) {
    it(`${testCaseName} - ${itemName}`, async () => {
        await fetchTestCase(browserContext, testCaseName);
        const element = await browserContext.driver.findElement(By.id('test-item-' + itemIndex));
        await scenario(element);
    });
};


/**
 * Open the page corresponding to the given test-case, take a screenshot for each item, and compare them to the reference.
 */
exports.itChecksScreenshots = function (browserContext, testCaseName, itemNames) {
    for (let i = 0; i < itemNames.length; ++i) {
        const itemName = itemNames[i];
        itCustom(browserContext, testCaseName, i, itemName, async element => {
            await takeScreenshot(browserContext, itemName, element);
            await compareScreenshot(browserContext, itemName);
        });
    }
};
