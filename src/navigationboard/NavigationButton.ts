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


/**
 * Descriptor for additional buttons to be added to the toolbar of {@link NavigationBoard}.
 */
export type NavigationButton = {

    /**
     * Button icon, defined as a SVG path (see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands for more details
     * on how to define a SVG path).
     *
     * The path is rendered within 32 x 32 viewbox (defined as `viewbox="0 0 32 32"`). It must be be a closed path, and must fit within the viewbox incircle.
     */
    iconPath: string,

    /**
     * Human-readable tooltip.
     */
    tooltip?: string,

    /**
     * Whether or not the button is enabled (true by default).
     */
    enabled?: boolean,

    /**
     * Callback invoked when the user clicks on the button.
     */
    onClick?: () => void,
};


/**
 * List of additional buttons to be added to the toolbar of {@link NavigationBoard}, together with optional spacers in-between.
 */
export type NavigationBar = (NavigationButton | 'spacer')[];


/**
 * Scheme of additional button list to be added to the toolbar of {@link NavigationBoard}, together with optional spacers in-between.
 */
export type NavigationBarScheme = ('button' | 'spacer')[];


/**
 * Whether the given object is a {@link NavigationButton} or not.
 */
export function isNavigationButton(button: unknown): button is NavigationButton {
    if (typeof button !== 'object' || button === null) {
        return false;
    }
    return typeof (button as NavigationButton).iconPath === 'string' &&
        ((button as NavigationButton).tooltip === undefined || typeof (button as NavigationButton).tooltip === 'string') &&
        ((button as NavigationButton).enabled === undefined || typeof (button as NavigationButton).enabled === 'boolean') &&
        ((button as NavigationButton).onClick === undefined || typeof (button as NavigationButton).onClick === 'function');
}


/**
 * Whether the given object is a {@link NavigationBar} or not.
 */
export function isNavigationBar(buttons: unknown): buttons is NavigationBar {
    if (Array.isArray(buttons)) {
        for (const button of buttons) {
            if (!(isNavigationButton(button) || button === 'spacer')) {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
}


/**
 * Whether the given object is a {@link NavigationBarScheme} or not.
 */
export function isNavigationBarScheme(buttons: unknown): buttons is NavigationBarScheme {
    if (Array.isArray(buttons)) {
        for (const button of buttons) {
            if (!(button === 'button' || button === 'spacer')) {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
}
