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


import { Colorset } from '../types';


/**
 * Default colorset.
 */
export const DEFAULT_COLORSET = 'original';


/**
 * Available colorsets.
 */
export const colorsets: Record<string, Colorset> = {};

colorsets.original = {
    b: '#b5876b',
    w: '#f0dec7',
    cb: '#04f',
    cg: '#0e0',
    cr: '#d00',
    cy: '#db0',
};

colorsets.gray = {
    b: '#bbbbbb',
    w: '#f8f8f8',
    cb: '#04f',
    cg: '#0a0',
    cr: '#d00',
    cy: '#a90',
};

colorsets.scid = {
    b: '#7389b6',
    w: '#f3f3f3',
    cb: '#04f',
    cg: '#0e0',
    cr: '#d00',
    cy: '#db0',
};

colorsets.wikipedia = {
    b: '#d18b47',
    w: '#ffce9e',
    cb: '#04f',
    cg: '#0e0',
    cr: '#d00',
    cy: '#db0',
};

colorsets.xboard = {
    b: '#77a26d',
    w: '#c8c365',
    cb: '#04f',
    cg: '#0f0',
    cr: '#d00',
    cy: '#ff0',
};


/*
 * Source: http://omgchess.blogspot.fr/2015/09/chess-board-color-schemes.html
 * Author: Gorgonian <http://omgchess.blogspot.fr/>
 */

colorsets.coral = {
    b: 'rgb(112,162,163)',
    w: 'rgb(177,228,185)',
    cb: '#04f',
    cg: '#080',
    cr: '#d00',
    cy: '#ff0',
};

colorsets.dusk = {
    b: 'rgb(112,102,119)',
    w: 'rgb(204,183,174)',
    cb: '#04f',
    cg: '#3f3',
    cr: '#f20',
    cy: '#ff0',
};

colorsets.emerald = {
    b: 'rgb(111,143,114)',
    w: 'rgb(173,189,143)',
    cb: '#04f',
    cg: '#6f6',
    cr: '#d00',
    cy: '#ff0',
};

colorsets.marine = {
    b: 'rgb(111,115,210)',
    w: 'rgb(157,172,255)',
    cb: '#04f',
    cg: '#6f6',
    cr: '#f50',
    cy: '#ff0',
};

colorsets.sandcastle = {
    b: 'rgb(184,139,74)',
    w: 'rgb(227,193,111)',
    cb: '#04f',
    cg: '#0c3',
    cr: '#d02',
    cy: '#ff0',
};

colorsets.wheat = {
    b: 'rgb(187,190,100)',
    w: 'rgb(234,240,206)',
    cb: '#04f',
    cg: '#0c3',
    cr: '#d00',
    cy: '#ff3',
};
