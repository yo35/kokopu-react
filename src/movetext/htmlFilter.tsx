/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2025  Yoann Le Montagner <yo35 -at- melix.net>       *
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
import * as htmlparser2 from 'htmlparser2';


/**
 * Those tags cannot have any children.
 */
const NO_CHILDREN_TAGS = new Set([ 'br', 'hr', 'img' ]);


/**
 * For internal use only.
 */
type ChildNode = ReturnType<typeof htmlparser2.parseDocument>['children'][0];


/**
 * Instantiate a filter to process the text fields in a {@link Movetext} component.
 *
 * @param isComment - Whether the filter is intended to process the comments.
 */
export function htmlFilter(type: 'header' | 'comment'): (text: string) => React.ReactNode {

    let allowedTags = [
        'span', // general purpose
        'a', // links
        'b', 'strong', 'i', 'em', // bold, italic
        'del', 'ins', 's', 'u', // underline, strikethrough
        'sub', 'sup', // subscript, superscript
        'abbr', // acronym (typically associated to a title=".." tooltip)
        'q', 'cite', // quotation and title of a work
        'mark', // highlighted text
        'small', // smaller text
    ];
    const allowedAttributes: Record<string, string[]> = {
        '*': [ 'class', 'id', 'title' ],
        'a': [ 'href', 'target' ],
    };

    if (type === 'comment') {
        allowedTags = allowedTags.concat([
            'div', // general purpose
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', // headings
            'p', 'br', // paragraph and line break
            'blockquote', // long quotation
            'img', // image
            'pre', // preformatted text
            'ul', 'ol', 'li', // lists
        ]);
        Object.assign(allowedAttributes, {
            img: [ 'alt', 'src', 'height', 'width' ],
        });
    }

    const sanitizer = new HtmlSanitizer({
        allowedTags: allowedTags,
        allowedAttributes: allowedAttributes,
    });
    return text => sanitizer.parse(text);
}


interface HtmlSanitizerProps {
    allowedTags?: string[],
    allowedAttributes?: Record<string, string[]>,
}


/**
 * HTML sanitizer: parse HTML string, keeping only the allowed HTML nodes, and the corresponding React object.
 */
class HtmlSanitizer {

    #allowedTags: Set<string>;
    #allowedAttributes: Map<string, Set<string>>;
    #keyCounter = 0;

    constructor({ allowedTags, allowedAttributes }: HtmlSanitizerProps) {
        this.#allowedTags = allowedTags ? new Set(allowedTags) : new Set();
        this.#allowedAttributes = allowedAttributes ? new Map(Object.entries(allowedAttributes).map(([ k, v ]) => [ k, new Set(v) ])) : new Map();
    }

    /**
     * @param text - HTML string to be parsed.
     * @returns React object corresponding to the given HTML string. Can also be a fragment, or just a simple string if the given HTML string
     *          does not contain any HTML tag.
     */
    parse(text: string): React.ReactNode {
        const dom = htmlparser2.parseDocument(text);

        // Ensure that the returned object is a non-empty node type.
        if (dom.type !== 'root') {
            return undefined;
        }

        // Process the children of the root node.
        const result: React.ReactNode[] = [];
        dom.children.forEach(child => {
            const childElement = this.processNode(child);
            if (childElement) {
                result.push(childElement);
            }
        });

        // Return the result.
        if (result.length === 0) {
            return undefined;
        }
        else if (result.length === 1) {
            return result[0];
        }
        else {
            return <React.Fragment key={this.allocateKey()}>{result}</React.Fragment>;
        }
    }

    private processNode(node: ChildNode): React.ReactNode {
        if (node.type === 'text') {
            return node.data;
        }
        else if (node.type === 'tag') {
            const children = NO_CHILDREN_TAGS.has(node.name) ? undefined : node.children.map(child => this.processNode(child));
            if (this.#allowedTags.has(node.name)) {
                const attributes = this.filterAttributes(node.name, node.attribs);
                attributes['key'] = this.allocateKey();
                return React.createElement(node.name, attributes, children);
            }
            else {
                return children ? <React.Fragment key={this.allocateKey()}>{children}</React.Fragment> : undefined;
            }
        }
        else {
            return undefined;
        }
    }

    private filterAttributes(nodeName: string, attributes: Record<string, string>) {
        const result: Record<string, string> = {};
        for (const [ attribute, value ] of Object.entries(attributes)) {
            if (this.isAttributeAllowed(nodeName, attribute)) {
                result[attribute === 'class' ? 'className' : attribute] = value;
            }
        }
        return result;
    }

    private isAttributeAllowed(nodeName: string, attribute: string) {
        if (attribute === 'key' || attribute === 'ref' || attribute === 'className') { // Those attributes are always forbidden.
            return false;
        }
        const allowedAttributesForCurrent = this.#allowedAttributes.get(nodeName);
        if (allowedAttributesForCurrent && allowedAttributesForCurrent.has(attribute)) {
            return true;
        }
        const allowedAttributesForAll = this.#allowedAttributes.get('*');
        if (allowedAttributesForAll && allowedAttributesForAll.has(attribute)) {
            return true;
        }
        return false;
    }

    private allocateKey() {
        return 'auto-' + (this.#keyCounter++);
    }

}
