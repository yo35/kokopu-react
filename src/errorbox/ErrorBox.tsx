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


import * as React from 'react';

import { i18n } from '../i18n';
import { sanitizeString, sanitizeOptional } from '../sanitization';
import { fillPlaceholder } from '../util';

import './ErrorBox.css';

const BACKWARD_CHARACTER_COUNT = 5;
const FORWARD_CHARACTER_COUNT = 36;
const ELLIPSIS_SYMBOL_LENGTH = 4; // Symbol is ... + space (before or after)


export interface ErrorBoxProps {

    /**
     * Title of the error box.
     */
    title: string;

    /**
     * Additional message providing details about the error.
     */
    message: string;

    /**
     * Raw text whose processing results in the error.
     */
    text?: string;

    /**
     * Index of the character within `text` that results in the error.
     */
    errorIndex?: number;

    /**
     * Index (1-based) of the line in which is the character that results in the error.
     */
    lineNumber?: number;
}


/**
 * Display an error message.
 */
export function ErrorBox({ title, message, text, errorIndex, lineNumber }: ErrorBoxProps) {

    // Sanitize the inputs.
    title = sanitizeString(title);
    message = sanitizeString(message);
    text = sanitizeOptional(text, sanitizeString);
    errorIndex = Number.isInteger(errorIndex) ? errorIndex : undefined;
    lineNumber = Number.isInteger(lineNumber) ? lineNumber : undefined;

    // Render the component.
    let excerpt: React.ReactNode = undefined;
    if (text && errorIndex !== undefined && errorIndex >= 0 && errorIndex < text.length) {
        excerpt = <div className="kokopu-errorExcerpt">{ellipsisAt(text, errorIndex, lineNumber)}</div>;
    }
    return (
        <div className="kokopu-errorBox">
            <div className="kokopu-errorTitle">{title}</div>
            <div className="kokopu-errorMessage">{message}</div>
            {excerpt}
        </div>
    );
}


/**
 * Cut the given text around character at position `pos`, keeping `BACKWARD_CHARACTER_COUNT` before it, and `FORWARD_CHARACTER_COUNT` after.
 */
function ellipsisAt(text: string, pos: number, lineNumber?: number) {

    // Compute the number of characters to keep before `pos`.
    let cutBeginningAt = pos - BACKWARD_CHARACTER_COUNT;
    let isBeginningEllipsed = true;
    for (let keptCharacterCount = 0; keptCharacterCount <= BACKWARD_CHARACTER_COUNT + ELLIPSIS_SYMBOL_LENGTH; ++keptCharacterCount) {
        const p = pos - keptCharacterCount - 1;
        if (p < 0 || text.charAt(p) === '\n' || text.charAt(p) === '\r') {
            cutBeginningAt = p + 1;
            isBeginningEllipsed = false;
            break;
        }
    }

    // Compute the number of characters to keep after `pos`.
    let cutEndAt = pos + FORWARD_CHARACTER_COUNT;
    let isEndEllipsed = true;
    for (let keptCharacterCount = 0; keptCharacterCount <= FORWARD_CHARACTER_COUNT + ELLIPSIS_SYMBOL_LENGTH; ++keptCharacterCount) {
        const p = pos + keptCharacterCount + 1;
        if (p >= text.length || text.charAt(p) === '\n' || text.charAt(p) === '\r') {
            cutEndAt = p - 1;
            isEndEllipsed = false;
            break;
        }
    }

    // Extract the sub-string around the requested position.
    let excerpt = (isBeginningEllipsed ? '... ' : '') + text.substring(cutBeginningAt, cutEndAt + 1) + (isEndEllipsed ? ' ...' : '');
    excerpt = excerpt.replace(/\s/g, ' ');
    let secondLine = ' '.repeat(pos - cutBeginningAt + (isBeginningEllipsed ? ELLIPSIS_SYMBOL_LENGTH : 0)) + '^';
    if (lineNumber && lineNumber >= 1) {
        secondLine += ` (${fillPlaceholder(i18n.LINE, lineNumber)})`;
    }
    return excerpt + '\n' + secondLine;
}
