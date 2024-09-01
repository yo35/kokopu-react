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

import { Chessboard, SmallScreenLimit } from '../../src/index';
import { buildComponentDemoCode } from './util';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import './demo.css';


interface PageState {
    squareSize: number,
    windowWidth: number,
    limits: SmallScreenLimit[],
}


export default class Page extends React.Component<object, PageState> {

    private windowResizeListener = () => this.handleWindowResize();

    constructor(props: object) {
        super(props);
        this.state = {
            squareSize: 56,
            windowWidth: window.innerWidth,
            limits: [
                { width: 160, squareSize: 12 },
                { width: 224, squareSize: 16 },
                { width: 250, turnVisible: false },
                { width: 340, squareSize: 24, coordinateVisible: false },
                { width: 450, squareSize: 32 },
                { width: 560, squareSize: 44 },
                { width: 600, squareSize: 52, coordinateVisible: true },
                { width: 640, squareSize: 24, coordinateVisible: false },
                { width: 750, squareSize: 32 },
                { width: 860, squareSize: 44 },
            ],
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.windowResizeListener);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeListener);
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
        return (
            <Box>
                <Typography>Resize the browser to see the chessboard adapt its size...</Typography>
                <Typography>{`Current browser width: ${this.state.windowWidth} px`}</Typography>
            </Box>
        );
    }

    private renderChessboard() {
        return (
            <Box>
                <Chessboard squareSize={this.state.squareSize} smallScreenLimits={this.state.limits} />
            </Box>
        );
    }

    private renderCode() {

        const limits = this.state.limits.map(limit => {
            const limitAttributes = [ `width: ${limit.width}` ];
            if ('squareSize' in limit) {
                limitAttributes.push(`squareSize: ${limit.squareSize}`);
            }
            if ('coordinateVisible' in limit) {
                limitAttributes.push(`coordinateVisible: ${limit.coordinateVisible}`);
            }
            if ('turnVisible' in limit) {
                limitAttributes.push(`turnVisible: ${limit.turnVisible}`);
            }
            return `    { ${limitAttributes.join(', ')} },\n`;
        });

        const attributes: string[] = [];
        attributes.push(`squareSize={${this.state.squareSize}}`);
        attributes.push('smallScreenLimits={limits}');
        return (
            <pre className="kokopu-demoCode">
                {
                    'const limits = [\n' +
                    limits.join('') +
                    '];\n' +
                    buildComponentDemoCode('Chessboard', attributes)
                }
            </pre>
        );
    }

    private handleWindowResize() {
        this.setState({ windowWidth: window.innerWidth });
    }

}
