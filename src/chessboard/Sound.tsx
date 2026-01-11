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

import moveSound from './sounds/move.ogg';


/**
 * Play a sound.
 */
export function Sound() {

    React.useEffect(() => {
        const audio = new Audio(moveSound);
        safePlay(audio);
        return () => audio.pause();
    }, []);

    return undefined;
}


async function safePlay(audio: HTMLAudioElement) {
    try {
        await audio.play();
    }
    catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // Ignore the errors (can typically happen if the audio is interrupted while fetching the sound file).
    }
}
