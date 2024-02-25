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

import './NavigationToolbar.css';

const THICKNESS = 2;
const CHEVRON_SIZE = 7;
const ARROW_SIZE = 5;
const ARROW_LENGTH = 16;


interface NavigationToolbarProps {
	flipButtonVisible: boolean;
	squareSize: number;
	onFirstClicked?: () => void;
	onPreviousClicked?: () => void;
	onNextClicked?: () => void;
	onLastClicked?: () => void;
	onFlipClicked?: () => void;
}


/**
 * Toolbar below the navigation board.
 */
export class NavigationToolbar extends React.Component<NavigationToolbarProps> {

	render() {
		const buttonSize = computeButtonSize(this.props.squareSize);
		const marginTop = Math.round(buttonSize / 4);
		return (
			<div className="kokopu-navigationToolbar" style={{ marginTop: marginTop }}>
				<NavigationButton size={buttonSize} tooltip={i18n.TOOLTIP_GO_FIRST} path={chevronPath(14, 16, -1) + ' ' + chevronPath(10, 16, -1)}
					onClick={this.props.onFirstClicked} />
				<NavigationButton size={buttonSize} tooltip={i18n.TOOLTIP_GO_PREVIOUS} path={chevronPath(12, 16, -1)}
					onClick={this.props.onPreviousClicked} />
				<NavigationButton size={buttonSize} tooltip={i18n.TOOLTIP_GO_NEXT} path={chevronPath(20, 16, 1)}
					onClick={this.props.onNextClicked} />
				<NavigationButton size={buttonSize} tooltip={i18n.TOOLTIP_GO_LAST} path={chevronPath(18, 16, 1) + ' ' + chevronPath(22, 16, 1)}
					onClick={this.props.onLastClicked} />
				{this.renderFlipButton(buttonSize)}
			</div>
		);
	}

	private renderFlipButton(buttonSize: number) {
		if (!this.props.flipButtonVisible) {
			return undefined;
		}
		return (<>
			<div className="kokopu-navigationSpacer" />
			<NavigationButton size={buttonSize} tooltip={i18n.TOOLTIP_FLIP} path={arrowPath(11, 25, 1) + ' ' + arrowPath(21, 7, -1)}
				onClick={this.props.onFlipClicked} />
		</>);
	}

}


interface NavigationButtonProps {
	size: number;
	tooltip: string;
	path: string;
	onClick?: () => void;
}


/**
 * Button for the navigation toolbar.
 */
function NavigationButton({ size, tooltip, path, onClick }: NavigationButtonProps) {
	return (
		<div className="kokopu-navigationButton" title={tooltip} onClick={onClick}>
			<svg viewBox="0 0 32 32" width={size} height={size}>
				<path d={`M 16 0 A 16 16 0 0 0 16 32 A 16 16 0 0 0 16 0 Z ${path}`} fill="currentcolor" />
			</svg>
		</div>
	);
}


/**
 *      * C
 *     / \
 *  B *   \
 *     \   \
 *      \   \
 *     A *   * D
 *      /   /
 *     /   /
 *  F *   /
 *     \ /
 *      * E
 *
 * (x,y) = middle of [AD]
 */
function chevronPath(x: number, y: number, direction: 1 | -1) {
	const xA = x - direction * THICKNESS * Math.sqrt(2) / 2;
	const xB = x - direction * (CHEVRON_SIZE + THICKNESS / Math.sqrt(2) / 2);
	const xC = x - direction * (CHEVRON_SIZE - THICKNESS / Math.sqrt(2) / 2);
	const xD = x + direction * THICKNESS * Math.sqrt(2) / 2;
	const yB = y - direction * (CHEVRON_SIZE - THICKNESS / Math.sqrt(2) / 2);
	const yC = y - direction * (CHEVRON_SIZE + THICKNESS / Math.sqrt(2) / 2);
	const yE = y + direction * (CHEVRON_SIZE + THICKNESS / Math.sqrt(2) / 2);
	const yF = y + direction * (CHEVRON_SIZE - THICKNESS / Math.sqrt(2) / 2);
	return `M ${xA} ${y} L ${xB} ${yB} L ${xC} ${yC} L ${xD} ${y} L ${xC} ${yE} L ${xB} ${yF} Z`;
}


/**
 *      D +---+ E
 *        |   |
 *        |   |
 *        |   |
 *   B *  |   |  * G
 *    / \ |   | / \
 * A *   \|   |/   * H
 *    \   *   *   /
 *     \  C   F  /
 *      \   O   /
 *       \  *  /
 *        \   /
 *         \ /
 *          *
 *        (x,y)
 */
function arrowPath(x: number, y: number, direction: 1 | -1) {
	const xA = x - direction * (ARROW_SIZE + THICKNESS / Math.sqrt(2) / 2);
	const xB = x - direction * (ARROW_SIZE - THICKNESS / Math.sqrt(2) / 2);
	const xC = x - direction * THICKNESS / 2;
	const xF = x + direction * THICKNESS / 2;
	const xG = x + direction * (ARROW_SIZE - THICKNESS / Math.sqrt(2) / 2);
	const xH = x + direction * (ARROW_SIZE + THICKNESS / Math.sqrt(2) / 2);
	const y0 = y - direction * THICKNESS * Math.sqrt(2) / 2;
	const yA = y0 - direction * (ARROW_SIZE - THICKNESS / Math.sqrt(2) / 2);
	const yB = y0 - direction * (ARROW_SIZE + THICKNESS / Math.sqrt(2) / 2);
	const yC = yB + (xC - xB);
	const yD = y - direction * ARROW_LENGTH;
	return `M ${x} ${y} L ${xA} ${yA} L ${xB} ${yB} L ${xC} ${yC} V ${yD} H ${xF} V ${yC} L ${xG} ${yB} L ${xH} ${yA} Z`;
}


/**
 * Return the height/width of the buttons assuming the given square size.
 */
function computeButtonSize(squareSize: number) {
	return Math.round((squareSize * 2 + 116) / 7);
}
