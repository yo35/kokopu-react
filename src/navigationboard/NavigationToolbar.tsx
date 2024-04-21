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
    const spacerSize = computeSpacerSize(squareSize);
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
            buttonNodes.push(<div key={buttonNodes.length} className="kokopu-navigationSpacer" style={{ width: spacerSize }} />);
        }
        atLeastOneButtonEncountered = true;

        // Enqueue the button node.
        buttonNodes.push(<NavigationButtonImpl
            key={buttonNodes.length}
            tooltip={button.tooltip} iconPath={button.iconPath} enabled={button.enabled} onClick={button.onClick}
            size={buttonSize}
            spaceOnLeft={i === 0 || buttons[i - 1] === 'spacer'}
            spaceOnRight={i === buttons.length - 1 || buttons[i + 1] === 'spacer'}
        />);
    }

    return <div className="kokopu-navigationToolbar" style={{ marginTop: Math.round(buttonSize / 4) }}>{buttonNodes}</div>;
}


interface NavigationButtonImplProps extends NavigationButton {
    size: number;
    spaceOnLeft: boolean;
    spaceOnRight: boolean;
}


/**
 * Button for the navigation toolbar.
 */
function NavigationButtonImpl({ size, spaceOnLeft, spaceOnRight, iconPath, tooltip, enabled, onClick }: NavigationButtonImplProps) {
    const leftBoundary = spaceOnLeft ? 'A 16 16 0 0 0 16 32' : 'L 1 0 L 1 32 L 16 32';
    const rightBoundary = spaceOnRight ? 'A 16 16 0 0 0 16 0' : 'L 31 32 L 31 0 L 16 0';
    const actuallyEnabled = enabled ?? true;
    return (
        <div className={actuallyEnabled ? 'kokopu-enabledNavigationButton' : 'kokopu-disabledNavigationButton'} title={tooltip}
            onClick={actuallyEnabled ? onClick : undefined}
        >
            <svg viewBox="0 0 32 32" width={size} height={size}>
                <path d={`M 16 0 ${leftBoundary} ${rightBoundary} Z ${iconPath}`} fill="currentcolor" />
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


/**
 * Return the width of the spacer between button groups, assuming the given square size.
 */
function computeSpacerSize(squareSize: number) {
    return Math.round((squareSize * 2 + 116) / 14);
}
