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

import { AnnotationColor, ArrowMarkerIcon, Chessboard, NavigationBoard } from '../../src/index';
import { buildComponentDemoCode } from './util';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import './demo.css';
import pgn from './game-3.pgn';


const COLOR_ICON_SIZE = 16;


interface PageState {
    squareSize: number;
    coordinateVisible: boolean;
    turnVisible: boolean;
    colorset: string;
    pieceset: string;
    moveArrowVisible: boolean;
    moveArrowColor: AnnotationColor;
    animated: boolean;
    flipButtonVisible: boolean;
}


export default class Page extends React.Component<object, PageState> {

    constructor(props: object) {
        super(props);
        this.state = {
            squareSize: 40,
            coordinateVisible: true,
            turnVisible: true,
            colorset: 'original',
            pieceset: 'cburnett',
            moveArrowVisible: true,
            moveArrowColor: 'b',
            animated: true,
            flipButtonVisible: true,
        };
    }

    render() {
        return (
            <Stack spacing={2} mt={2}>
                {this.renderControls()}
                {this.renderNavigationBoard()}
                {this.renderCode()}
            </Stack>
        );
    }

    private renderControls() {
        return (<>
            <Stack direction="row" spacing={2} alignItems="center">
                <FormControlLabel label="Show flip button"
                    control={<Switch checked={this.state.flipButtonVisible} onChange={() => this.setState({ flipButtonVisible: !this.state.flipButtonVisible })} color="primary" />}
                />
                <FormControlLabel label="Show coordinates"
                    control={<Switch checked={this.state.coordinateVisible} onChange={() => this.setState({ coordinateVisible: !this.state.coordinateVisible })} color="primary" />}
                />
                <FormControlLabel label="Show turn"
                    control={<Switch checked={this.state.turnVisible} onChange={() => this.setState({ turnVisible: !this.state.turnVisible })} color="primary" />}
                />
                <FormControlLabel label="Animated"
                    control={<Switch checked={this.state.animated} onChange={() => this.setState({ animated: !this.state.animated })} color="primary" />}
                />
            </Stack>
            <Box>
                <Typography gutterBottom>Square size</Typography>
                <Slider
                    value={this.state.squareSize} onChange={(_, newValue) => this.setState({ squareSize: newValue as number })}
                    min={Chessboard.minSquareSize()} max={Chessboard.maxSquareSize()} step={1} valueLabelDisplay="on" color="primary"
                />
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
                <FormControl variant="standard">
                    <InputLabel id="colorset-label">Colorset</InputLabel>
                    <Select labelId="colorset-label" sx={{ width: '8em' }} value={this.state.colorset} onChange={evt => this.setState({ colorset: evt.target.value })}>
                        {Object.keys(Chessboard.colorsets()).sort().map(colorset => <MenuItem key={colorset} value={colorset}>{colorset}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl variant="standard">
                    <InputLabel id="pieceset-label">Pieceset</InputLabel>
                    <Select labelId="pieceset-label" sx={{ width: '8em' }} value={this.state.pieceset} onChange={evt => this.setState({ pieceset: evt.target.value })}>
                        {Object.keys(Chessboard.piecesets()).sort().map(pieceset => <MenuItem key={pieceset} value={pieceset}>{pieceset}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControlLabel label="Show move arrow"
                    control={<Switch checked={this.state.moveArrowVisible} onChange={() => this.setState({ moveArrowVisible: !this.state.moveArrowVisible })} color="primary" />}
                />
                {this.renderMoveArrowColorSelector()}
            </Stack>
        </>);
    }

    private renderMoveArrowColorSelector() {
        if (!this.state.moveArrowVisible) {
            return undefined;
        }
        const colorset = Chessboard.colorsets()['original'];
        return (
            <ToggleButtonGroup value={this.state.moveArrowColor} exclusive size="small" onChange={(_, newColor) => this.handleMoveArrowColorChanged(newColor)}>
                <ToggleButton value="b"><ArrowMarkerIcon size={COLOR_ICON_SIZE} color={colorset.cb} /></ToggleButton>
                <ToggleButton value="g"><ArrowMarkerIcon size={COLOR_ICON_SIZE} color={colorset.cg} /></ToggleButton>
                <ToggleButton value="r"><ArrowMarkerIcon size={COLOR_ICON_SIZE} color={colorset.cr} /></ToggleButton>
                <ToggleButton value="y"><ArrowMarkerIcon size={COLOR_ICON_SIZE} color={colorset.cy} /></ToggleButton>
            </ToggleButtonGroup>
        );
    }

    private renderNavigationBoard() {
        return (
            <Box>
                <NavigationBoard
                    game={pgn}
                    initialNodeId="end"
                    squareSize={this.state.squareSize}
                    coordinateVisible={this.state.coordinateVisible}
                    turnVisible={this.state.turnVisible}
                    colorset={this.state.colorset}
                    pieceset={this.state.pieceset}
                    moveArrowVisible={this.state.moveArrowVisible}
                    moveArrowColor={this.state.moveArrowColor}
                    animated={this.state.animated}
                    flipButtonVisible={this.state.flipButtonVisible}
                />
            </Box>
        );
    }

    private renderCode() {
        const attributes: string[] = [];
        attributes.push('game={pgn}');
        attributes.push('initialNodeId="end"');
        attributes.push(`squareSize={${this.state.squareSize}}`);
        attributes.push(`coordinateVisible={${this.state.coordinateVisible}}`);
        attributes.push(`turnVisible={${this.state.turnVisible}}`);
        attributes.push(`colorset="${this.state.colorset}"`);
        attributes.push(`pieceset="${this.state.pieceset}"`);
        attributes.push(`moveArrowVisible={${this.state.moveArrowVisible}}`);
        if (this.state.moveArrowVisible) {
            attributes.push(`moveArrowColor="${this.state.moveArrowColor}"`);
        }
        attributes.push(`animated={${this.state.animated}}`);
        attributes.push(`flipButtonVisible={${this.state.flipButtonVisible}}`);
        const pgnDeclaration = 'const pgn = `\n' + pgn.trim() + '`;\n\n';
        return <pre className="kokopu-demoCode">{pgnDeclaration + buildComponentDemoCode('NavigationBoard', attributes)}</pre>;
    }

    private handleMoveArrowColorChanged(newColor: AnnotationColor | null) {
        if (newColor !== null) {
            this.setState({ moveArrowColor: newColor });
        }
    }

}
