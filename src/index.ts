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


export { i18n } from './i18n';
export * as exception from './exception';

export { ChessPieceIconType, Colorset, Pieceset, PieceSymbolMapping, AnnotationColor, AnnotationSymbol, SquareMarkerSet, TextMarkerSet, ArrowMarkerSet,
    isChessPieceIconType, isPieceSymbolMapping, isAnnotationColor, isAnnotationSymbol, flattenSquareMarkers, flattenTextMarkers, flattenArrowMarkers,
    parseSquareMarkers, parseTextMarkers, parseArrowMarkers } from './types';

export { ErrorBox, ErrorBoxProps } from './errorbox/ErrorBox';

export { SquareMarkerIcon, SquareMarkerIconProps } from './icons/SquareMarkerIcon';
export { TextMarkerIcon, TextMarkerIconProps } from './icons/TextMarkerIcon';
export { ArrowMarkerIcon, ArrowMarkerIconProps } from './icons/ArrowMarkerIcon';
export { ChessPieceIcon, ChessPieceIconProps } from './icons/ChessPieceIcon';

export { SmallScreenLimit } from './chessboard/BoardProperties';
export { Chessboard, ChessboardProps } from './chessboard/Chessboard';

export { formatMove, moveFormatter } from './movetext/moveFormatter';
export { Movetext, MovetextProps, MoveSelectEventOrigin } from './movetext/Movetext';

export { NavigationButton, NavigationBar, NavigationBarScheme, isNavigationButton, isNavigationBar, isNavigationBarScheme } from './navigationboard/NavigationButton';
export { firstNodeId, previousNodeId, nextNodeId, lastNodeId } from './navigationboard/NavigationField';
export { NavigationBoard, NavigationBoardProps } from './navigationboard/NavigationBoard';
