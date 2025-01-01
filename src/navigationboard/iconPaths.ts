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


const THICKNESS = 2;
const CHEVRON_SIZE = 7;
const ARROW_SIZE = 5;
const ARROW_LENGTH = 16;


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


export const GO_FIRST_ICON_PATH = chevronPath(14, 16, -1) + ' ' + chevronPath(10, 16, -1);
export const GO_PREVIOUS_ICON_PATH = chevronPath(12, 16, -1);
export const GO_NEXT_ICON_PATH = chevronPath(20, 16, 1);
export const GO_LAST_ICON_PATH = chevronPath(18, 16, 1) + ' ' + chevronPath(22, 16, 1);
export const PLAY_ICON_PATH = 'M 23 16 L 12 23 V 9 Z';
export const STOP_ICON_PATH = 'M 11 11 H 21 V 21 H 11 Z';
export const FLIP_ICON_PATH = arrowPath(11, 25, 1) + ' ' + arrowPath(21, 7, -1);
