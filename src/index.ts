/* -------------------------------------------------------------------------- *
 *                                                                            *
 *    This file is part of Kokopu-React, a JavaScript chess library.          *
 *    Copyright (C) 2021-2023  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    This program is free software: you can redistribute it and/or           *
 *    modify it under the terms of the GNU Lesser General Public License      *
 *    as published by the Free Software Foundation, either version 3 of       *
 *    the License, or (at your option) any later version.                     *
 *                                                                            *
 *    This program is distributed in the hope that it will be useful,         *
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

export { Colorset, Pieceset, PieceSymbolMapping, AnnotationColor, AnnotationSymbol, SquareMarkerSet, TextMarkerSet, ArrowMarkerSet, isPieceSymbolMapping,
	isAnnotationColor, isAnnotationSymbol, flattenSquareMarkers, flattenTextMarkers, flattenArrowMarkers, parseSquareMarkers, parseTextMarkers, parseArrowMarkers } from './types';

export { ErrorBox, ErrorBoxProps } from './errorbox/ErrorBox';

export { SquareMarkerIcon, SquareMarkerIconProps } from './icons/SquareMarkerIcon';
export { TextMarkerIcon, TextMarkerIconProps } from './icons/TextMarkerIcon';
export { ArrowMarkerIcon, ArrowMarkerIconProps } from './icons/ArrowMarkerIcon';

export { Chessboard, ChessboardProps, SmallScreenLimit } from './chessboard/Chessboard';

export { formatMove, moveFormatter } from './movetext/moveFormatter';
export { Movetext, MovetextProps, MoveSelectEventOrigin } from './movetext/Movetext';
