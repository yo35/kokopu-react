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
import { Position, Color, ColoredPiece, Square, SquareCouple, oppositeColor } from 'kokopu';

import { AnnotationColor, AnnotationSymbol, SquareMarkerSet, TextMarkerSet, ArrowMarkerSet, Chessboard, ChessboardProps, SquareMarkerIcon, TextMarkerIcon, ArrowMarkerIcon,
    flattenSquareMarkers, flattenTextMarkers, flattenArrowMarkers } from '../../src/index';
import { buildComponentDemoCode } from './util';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import './demo.css';


const PIECE_ICON_SIZE = 24;
const COLOR_ICON_SIZE = 16;
const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';


interface PageState {
    position: Position;
    flipped: boolean;
    interactionMode: 'none' | 'addRemovePieces' | 'movePieces' | 'playMoves' | 'editSquareMarkers' | 'editTextMarkers' | 'editArrowMarkers';
    pieceEditMode: ColoredPiece;
    squareMarkerColor: AnnotationColor;
    textMarkerColor: AnnotationColor;
    textMarkerSymbol: AnnotationSymbol;
    arrowMarkerColor: AnnotationColor;
    squareMarkers: SquareMarkerSet;
    textMarkers: TextMarkerSet;
    arrowMarkers: ArrowMarkerSet;
}


export default class Page extends React.Component<object, PageState> {

    constructor(props: object) {
        super(props);
        this.state = {
            position: new Position(),
            flipped: false,
            interactionMode: 'movePieces',
            pieceEditMode: 'wp',
            squareMarkerColor: 'g',
            textMarkerColor: 'g',
            textMarkerSymbol: 'A',
            arrowMarkerColor: 'g',
            squareMarkers: {},
            textMarkers: {},
            arrowMarkers: {},
        };
    }

    render() {
        return (
            <Stack spacing={2} mt={2}>
                {this.renderControls()}
                {this.renderChessboard()}
                {this.renderCode()}
            </Stack>
        );
    }

    private renderControls() {
        return (<>
            <Stack direction="row" spacing={2} alignItems="center">
                <FormControlLabel label="Flip"
                    control={<Switch checked={this.state.flipped} onChange={() => this.setState({ flipped: !this.state.flipped })} color="primary" />}
                />
                <Button color="primary" size="small" variant="contained" onClick={() => this.handleTurnClicked(oppositeColor(this.state.position.turn()))}>
                    Change turn
                </Button>
                <ButtonGroup color="primary" size="small">
                    <Button onClick={() => this.setState({ position: new Position('empty') })}>Clear</Button>
                    <Button onClick={() => this.setState({ position: new Position() })}>Reset</Button>
                </ButtonGroup>
            </Stack>
            <Box>
                <Typography gutterBottom>Interaction mode</Typography>
                <RadioGroup value={this.state.interactionMode} onChange={evt => this.setState({ interactionMode: evt.target.value as PageState['interactionMode'] })}>
                    <FormControlLabel value="none" control={<Radio color="primary" />} label="None" />
                    <FormControlLabel value="addRemovePieces" control={<Radio color="primary" />} label={
                        <Stack direction="row" spacing={2} alignItems="center">
                            <span>Add/remove pieces</span>
                            {this.renderPieceSelector()}
                        </Stack>
                    } />
                    <FormControlLabel value="movePieces" control={<Radio color="primary" />} label="Move pieces" />
                    <FormControlLabel value="playMoves" control={<Radio color="primary" />} label="Move pieces (obeying chess rules)" />
                    <FormControlLabel value="editSquareMarkers" control={<Radio color="primary" />} label={
                        <Stack direction="row" spacing={2} alignItems="center">
                            <span>Edit square annotations</span>
                            {this.renderMarkerColorSelector('editSquareMarkers', this.state.squareMarkerColor, newColor => this.handleSquareMarkerColorChanged(newColor))}
                        </Stack>
                    } />
                    <FormControlLabel value="editTextMarkers" control={<Radio color="primary" />} label={
                        <Stack direction="row" spacing={2} alignItems="center">
                            <span>Edit text annotations</span>
                            {this.renderMarkerColorSelector('editTextMarkers', this.state.textMarkerColor, newColor => this.handleTextMarkerColorChanged(newColor))}
                            {this.renderTextMarkerSymbolSelector()}
                        </Stack>
                    } />
                    <FormControlLabel value="editArrowMarkers" control={<Radio color="primary" />} label={
                        <Stack direction="row" spacing={2} alignItems="center">
                            <span>Edit arrow annotations</span>
                            {this.renderMarkerColorSelector('editArrowMarkers', this.state.arrowMarkerColor, newColor => this.handleArrowMarkerColorChanged(newColor))}
                        </Stack>
                    } />
                </RadioGroup>
            </Box>
        </>);
    }

    private renderPieceSelector() {
        if (this.state.interactionMode !== 'addRemovePieces') {
            return undefined;
        }
        const pieceset = Chessboard.piecesets()['cburnett'];
        return (
            <Stack spacing={0.5}>
                <ToggleButtonGroup value={this.state.pieceEditMode} exclusive size="small" onChange={(_, newMode) => this.handlePieceEditModeChanged(newMode)}>
                    <ToggleButton value="wk"><img src={pieceset.wk} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                    <ToggleButton value="wq"><img src={pieceset.wq} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                    <ToggleButton value="wr"><img src={pieceset.wr} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                    <ToggleButton value="wb"><img src={pieceset.wb} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                    <ToggleButton value="wn"><img src={pieceset.wn} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                    <ToggleButton value="wp"><img src={pieceset.wp} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup value={this.state.pieceEditMode} exclusive size="small" onChange={(_, newMode) => this.handlePieceEditModeChanged(newMode)}>
                    <ToggleButton value="bk"><img src={pieceset.bk} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                    <ToggleButton value="bq"><img src={pieceset.bq} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                    <ToggleButton value="br"><img src={pieceset.br} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                    <ToggleButton value="bb"><img src={pieceset.bb} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                    <ToggleButton value="bn"><img src={pieceset.bn} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                    <ToggleButton value="bp"><img src={pieceset.bp} width={PIECE_ICON_SIZE} height={PIECE_ICON_SIZE} /></ToggleButton>
                </ToggleButtonGroup>
            </Stack>
        );
    }

    private renderTextMarkerSymbolSelector() {
        if (this.state.interactionMode !== 'editTextMarkers') {
            return undefined;
        }
        const availableSymbols = [ 'plus', 'times', 'dot', 'circle' ].concat([...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789']);
        return (
            <Select variant="standard" value={this.state.textMarkerSymbol} onChange={evt => this.setState({ textMarkerSymbol: evt.target.value as AnnotationSymbol })}>
                {availableSymbols.map(mode => <MenuItem key={mode} value={mode}>{mode}</MenuItem>)}
            </Select>
        );
    }

    private renderMarkerColorSelector(expectedInterationMode: PageState['interactionMode'], currentColor: AnnotationColor, onChange: (newColor: AnnotationColor | null) => void) {
        if (this.state.interactionMode !== expectedInterationMode) {
            return undefined;
        }
        const colorset = Chessboard.colorsets()['original'];
        return (
            <ToggleButtonGroup value={currentColor} exclusive size="small" onChange={(_, newColor) => onChange(newColor)}>
                <ToggleButton className="kokopu-fixTextTransform" value="b">{this.renderColorButtonLabel(colorset.cb)}</ToggleButton>
                <ToggleButton className="kokopu-fixTextTransform" value="g">{this.renderColorButtonLabel(colorset.cg)}</ToggleButton>
                <ToggleButton className="kokopu-fixTextTransform" value="r">{this.renderColorButtonLabel(colorset.cr)}</ToggleButton>
                <ToggleButton className="kokopu-fixTextTransform" value="y">{this.renderColorButtonLabel(colorset.cy)}</ToggleButton>
            </ToggleButtonGroup>
        );
    }

    private renderColorButtonLabel(color: string) {
        switch (this.state.interactionMode) {
            case 'editSquareMarkers':
                return <SquareMarkerIcon size={COLOR_ICON_SIZE} color={color} />;
            case 'editTextMarkers':
                return <TextMarkerIcon size={COLOR_ICON_SIZE} symbol={this.state.textMarkerSymbol} color={color} />;
            case 'editArrowMarkers':
                return <ArrowMarkerIcon size={COLOR_ICON_SIZE} color={color} />;
            default:
                return undefined;
        }
    }

    private renderChessboard() {
        return (
            <Box>
                <Chessboard
                    position={this.state.position}
                    flipped={this.state.flipped}
                    squareMarkers={this.state.squareMarkers}
                    textMarkers={this.state.textMarkers}
                    arrowMarkers={this.state.arrowMarkers}
                    interactionMode={this.getChessboardInterationMode()}
                    editedArrowColor={this.state.arrowMarkerColor}
                    onPieceMoved={(from, to) => this.handlePieceMoved(from, to)}
                    onMovePlayed={move => this.handleMovePlayed(move)}
                    onArrowEdited={(from, to) => this.handleArrowEdited(from, to)}
                    onSquareClicked={sq => this.handleSquareClicked(sq)}
                />
            </Box>
        );
    }

    private renderCode() {
        const attributes: string[] = [];
        const fen = this.state.position.fen();
        if (fen !== DEFAULT_FEN) {
            attributes.push(`position="${fen}"`);
        }
        if (this.state.flipped) {
            attributes.push('flipped');
        }
        const squareMarkers = flattenSquareMarkers(this.state.squareMarkers);
        const textMarkers = flattenTextMarkers(this.state.textMarkers);
        const arrowMarkers = flattenArrowMarkers(this.state.arrowMarkers);
        if (squareMarkers !== '') {
            attributes.push(`squareMarkers="${squareMarkers}"`);
        }
        if (textMarkers !== '') {
            attributes.push(`textMarkers="${textMarkers}"`);
        }
        if (arrowMarkers !== '') {
            attributes.push(`arrowMarkers="${arrowMarkers}"`);
        }
        switch (this.state.interactionMode) {
            case 'addRemovePieces':
            case 'editSquareMarkers':
            case 'editTextMarkers':
                attributes.push('interactionMode="clickSquares"');
                attributes.push('onSquareClicked={sq => handleSquareClicked(sq)}');
                break;
            case 'editArrowMarkers':
                attributes.push('interactionMode="editArrows"');
                attributes.push(`editedArrowColor="${this.state.arrowMarkerColor}"`);
                attributes.push('onArrowEdited={(from, to) => handleArrowEdited(from, to)}');
                break;
            case 'movePieces':
                attributes.push('interactionMode="movePieces"');
                attributes.push('onPieceMoved={(from, to) => handlePieceMoved(from, to)}');
                break;
            case 'playMoves':
                attributes.push('interactionMode="playMoves"');
                attributes.push('onMovePlayed={move => handleMovePlayed(move)}');
                break;
            default:
                break;
        }
        return <pre className="kokopu-demoCode">{buildComponentDemoCode('Chessboard', attributes)}</pre>;
    }

    private handlePieceEditModeChanged(newPieceEditMode: ColoredPiece | null) {
        if (newPieceEditMode !== null) {
            this.setState({ pieceEditMode: newPieceEditMode });
        }
    }

    private handleSquareMarkerColorChanged(newColor: AnnotationColor | null) {
        if (newColor !== null) {
            this.setState({ squareMarkerColor: newColor });
        }
    }

    private handleTextMarkerColorChanged(newColor: AnnotationColor | null) {
        if (newColor !== null) {
            this.setState({ textMarkerColor: newColor });
        }
    }

    private handleArrowMarkerColorChanged(newColor: AnnotationColor | null) {
        if (newColor !== null) {
            this.setState({ arrowMarkerColor: newColor });
        }
    }

    private handleTurnClicked(newTurn: Color) {
        const newPosition = new Position(this.state.position);
        newPosition.turn(newTurn);
        this.setState({ position: newPosition });
    }

    private handlePieceMoved(from: Square, to: Square) {
        const newPosition = new Position(this.state.position);
        newPosition.square(to, newPosition.square(from));
        newPosition.square(from, '-');
        this.setState({ position: newPosition });
    }

    private handleMovePlayed(move: string) {
        const newPosition = new Position(this.state.position);
        newPosition.play(move);
        this.setState({ position: newPosition });
    }

    private handleArrowEdited(from: Square, to: Square) {
        const newArrowMarkers = { ...this.state.arrowMarkers };
        const key = from + to as SquareCouple;
        if (newArrowMarkers[key] === this.state.arrowMarkerColor) {
            delete newArrowMarkers[key];
        }
        else {
            newArrowMarkers[key] = this.state.arrowMarkerColor;
        }
        this.setState({ arrowMarkers: newArrowMarkers });
    }

    private handleSquareClicked(sq: Square) {
        if (this.state.interactionMode === 'editSquareMarkers') {
            const newSquareMarkers = { ...this.state.squareMarkers };
            if (newSquareMarkers[sq] === this.state.squareMarkerColor) {
                delete newSquareMarkers[sq];
            }
            else {
                newSquareMarkers[sq] = this.state.squareMarkerColor;
            }
            this.setState({ squareMarkers: newSquareMarkers });
        }
        else if (this.state.interactionMode === 'editTextMarkers') {
            const newTextMarkers = { ...this.state.textMarkers };
            if (newTextMarkers[sq] && newTextMarkers[sq]!.color === this.state.textMarkerColor && newTextMarkers[sq]!.symbol === this.state.textMarkerSymbol) {
                delete newTextMarkers[sq];
            }
            else {
                newTextMarkers[sq] = { color: this.state.textMarkerColor, symbol: this.state.textMarkerSymbol };
            }
            this.setState({ textMarkers:  newTextMarkers });
        }
        else if (this.state.interactionMode === 'addRemovePieces') {
            const newPosition = new Position(this.state.position);
            newPosition.square(sq, newPosition.square(sq) === this.state.pieceEditMode ? '-' : this.state.pieceEditMode);
            this.setState({ position: newPosition });
        }
    }

    private getChessboardInterationMode(): ChessboardProps['interactionMode'] {
        switch (this.state.interactionMode) {
            case 'addRemovePieces':
            case 'editSquareMarkers':
            case 'editTextMarkers':
                return 'clickSquares';
            case 'editArrowMarkers':
                return 'editArrows';
            case 'movePieces':
            case 'playMoves':
                return this.state.interactionMode;
            default:
                return undefined;
        }
    }

}
