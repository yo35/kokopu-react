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

import { NavigationBoard } from '../../src/index';
import { buildComponentDemoCode } from './util';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import './demo.css';
import pgn from './game-short.pgn';


interface PageState {
    nodeId: string,
}


export default class Page extends React.Component<object, PageState> {

    constructor(props: object) {
        super(props);
        this.state = {
            nodeId: '9b',
        };
    }

    render() {
        return (
            <Stack spacing={2} mt={2}>
                {this.renderControls()}
                {this.renderNavigationBoards()}
                {this.renderCode()}
            </Stack>
        );
    }

    private renderControls() {
        return (
            <>
                <Typography>
                    In uncontrolled mode, the current node ID (aka. the current move) of the <code>NavigationBoard</code> component is managed internally.
                    No additional code is needed to make the navigation buttons work.
                </Typography>
                <Typography>
                    In controlled mode, the current node ID is defined by the <code>nodeId</code> attribute, and a callback must be set
                    on the <code>onNodeIdChanged</code> attribute to respond to clicks on the navigation buttons.
                    This mode requires more code, as a state variable holding the current node ID must be explicitely managed out of the component,
                    but it allows to define more complex behaviors (e.g. synchronizing the node ID on the <code>NavigationBoard</code> with another component).
                </Typography>
                <Typography>
                    Whether the component is in uncontrolled mode or controlled mode depends on the presence of the <code>nodeId</code> attribute.
                </Typography>
            </>
        );
    }

    private renderNavigationBoards() {
        return (
            <Box display="flex" alignItems="top" justifyContent="space-around">
                <Box>
                    <NavigationBoard game={pgn} animated sound initialNodeId="9b" />
                    <Typography mt={2} textAlign="center">Uncontrolled</Typography>
                </Box>
                <Box>
                    <NavigationBoard game={pgn} animated sound nodeId={this.state.nodeId} onNodeIdChanged={nodeId => this.setState({ nodeId: nodeId })} />
                    <Typography mt={2} textAlign="center">Controlled</Typography>
                    <Typography textAlign="center">{`Current node ID: ${this.state.nodeId}`}</Typography>
                </Box>
            </Box>
        );
    }

    private renderCode() {

        const uncontrolledAttributes: string[] = [];
        uncontrolledAttributes.push('game={pgn}');
        uncontrolledAttributes.push('animated');
        uncontrolledAttributes.push('sound');
        uncontrolledAttributes.push('initialNodeId="9b"');

        const controlledAttributes: string[] = [];
        controlledAttributes.push('game={pgn}');
        controlledAttributes.push('animated');
        controlledAttributes.push('sound');
        controlledAttributes.push(`nodeId="${this.state.nodeId}"`);
        controlledAttributes.push('onNodeIdChanged={nodeId => handleNodeIdChanged(nodeId)}');

        const pgnDeclaration = 'const pgn = `\n' + pgn.trim() + '`;\n\n';
        return (
            <pre className="kokopu-demoCode">
                {pgnDeclaration + '// Uncontrolled\n' + buildComponentDemoCode('NavigationBoard', uncontrolledAttributes)
                    + '\n\n// Controlled\n' + buildComponentDemoCode('NavigationBoard', controlledAttributes)}
            </pre>
        );
    }

}
