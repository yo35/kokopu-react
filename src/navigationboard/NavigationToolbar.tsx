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

import { NavigationButton, NavigationButtonList } from './NavigationButton';

import './NavigationToolbar.css';


interface NavigationToolbarProps {
    squareSize: number;
    buttons: NavigationButtonList;
}


/**
 * Toolbar below the navigation board.
 */
export function NavigationToolbar({ squareSize, buttons }: NavigationToolbarProps) {

    const buttonSize = computeButtonSize(squareSize);
    const buttonNodes: React.ReactNode[] = [];

    let atLeastOneButtonEncountered = false;
    for (let i = 0; i < buttons.length; ++i) {

        const button = buttons[i];

        // Skip the spacers.
        if (button === 'spacer') {
            continue;
        }

        // Enqueue a spacer if necessary.
        // Remark: consecutive spacers are collapsed into a single one for rendering, and spacers at the begin and end of the button list are not rendered.
        if (atLeastOneButtonEncountered && buttons[i - 1] === 'spacer') {
            buttonNodes.push(<div key={buttonNodes.length} className="kokopu-navigationSpacer" />);
        }
        atLeastOneButtonEncountered = true;

        // Enqueue the button node.
        buttonNodes.push(
            <NavigationButtonImpl key={buttonNodes.length} size={buttonSize} tooltip={button.tooltip} iconPath={button.iconPath} onClick={button.onClick} />
        );
    }

    return <div className="kokopu-navigationToolbar" style={{ marginTop: Math.round(buttonSize / 4) }}>{buttonNodes}</div>;
}


interface NavigationButtonImplProps extends NavigationButton {
    size: number;
}


/**
 * Button for the navigation toolbar.
 */
function NavigationButtonImpl({ size, tooltip, iconPath, onClick }: NavigationButtonImplProps) {
    return (
        <div className="kokopu-navigationButton" title={tooltip} onClick={onClick}>
            <svg viewBox="0 0 32 32" width={size} height={size}>
                <path d={`M 16 0 A 16 16 0 0 0 16 32 A 16 16 0 0 0 16 0 Z ${iconPath}`} fill="currentcolor" />
            </svg>
        </div>
    );
}


/**
 * Return the height/width of the buttons assuming the given square size.
 */
function computeButtonSize(squareSize: number) {
    return Math.round((squareSize * 2 + 116) / 7);
}
