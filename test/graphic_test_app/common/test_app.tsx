/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2026  Yoann Le Montagner <yo35 -at- melix.net>       *
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


import * as React from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';

import './test_app.css';


// These global variables are used for testing purposes.
/* eslint-disable camelcase */
declare global {
    var __kokopu_debug_freeze_motion: number;
    var __kokopu_debug_sound: string;
}
/* eslint-enable */


interface TestItemContainerProps {
    index: number,
    children: React.ReactNode,
}


interface TestItemContainerState {
    hasError: boolean,
}


class TestItemContainer extends React.Component<TestItemContainerProps, TestItemContainerState> {

    constructor(props: TestItemContainerProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        return (
            <div className="test-item-container">
                <div className="test-item" id={'test-item-' + this.props.index}>{this.renderContent()}</div>
            </div>
        );
    }

    private renderContent() {
        return this.state.hasError ? <span className="test-item-error">Exception thrown</span> : this.props.children;
    }
}


function flattenMultiElements(elements: React.ReactNode[], containerClassName: string[]) {
    const items = [];
    for (let i = 0; i < elements.length; ++i) {
        items.push(<TestItemContainer key={i} index={i}>{elements[i]}</TestItemContainer>);
    }
    return <div className={containerClassName.join(' ')}>{items}</div>;
}


/**
 * Create an DIV element at the root of the current document, and render the given elements in it.
 */
export function testApp(elements: React.ReactNode[], ...containerClassName: string[]) {

    // Create the main anchor.
    const anchor = document.createElement('div');
    anchor.id = 'test-app';
    document.body.appendChild(anchor);

    // Render the content.
    const root = createRoot(anchor);
    const content = flattenMultiElements(elements, containerClassName);
    root.render(content);

    // Append a text area
    const sandbox = document.createElement('pre');
    sandbox.id = 'sandbox';
    document.body.appendChild(sandbox);
}


/**
 * Set the content of the sandbox.
 */
export function setSandbox(text: string) {
    const sandbox = document.getElementById('sandbox');
    if (sandbox === null) {
        throw new Error('Cannot locate the sandbox...');
    }
    sandbox.innerText = text;
}


/**
 * Renders `children` into an `<iframe>` through a React portal, without loading any separate script into that iframe.
 *
 * This reproduces the way the WordPress block editor renders block content since WP 7.1: a single React root running
 * in the top window uses `ReactDOM.createPortal` to paint a subtree into the iframe's document, so the corresponding
 * component instances (and everything they close over) keep executing in the top window's JS realm, even though the
 * DOM nodes they produce live in the iframe's document.
 *
 * See issue #35.
 */
export function IframePortal({ children }: { children: React.ReactNode }) {

    const [ iframeBody, setIframeBody ] = React.useState<HTMLElement | null>(null);

    const handleRef = React.useCallback((iframe: HTMLIFrameElement | null) => {
        if (!iframe) {
            return;
        }

        function attach() {
            const iframeDocument = iframe!.contentDocument!;
            // Copy the stylesheets over, otherwise the chessboard rendered in the iframe would be unstyled.
            document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(styleNode => iframeDocument.head.appendChild(styleNode.cloneNode(true)));
            setIframeBody(iframeDocument.body);
        }

        // Depending on unpredicatable browser behavior, the iframe's `load` event may have already fired by the time this callback runs,
        // or it may not have fired yet. In the former case, we can attach immediately; in the latter case, we must wait for `load`.
        if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
            attach();
        }
        else {
            iframe.addEventListener('load', attach, { once: true });
        }
    }, []);

    return (
        <iframe ref={handleRef}>
            {iframeBody ? createPortal(children, iframeBody) : undefined}
        </iframe>
    );
}
