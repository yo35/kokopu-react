/******************************************************************************
 *                                                                            *
 *    This file is part of KokopuReact, a JavaScript chess library.           *
 *    Copyright (C) 2021  Yoann Le Montagner <yo35 -at- melix.net>            *
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
 ******************************************************************************/


import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { initialState0, Page0 } from './page0';
import { initialState1, Page1 } from './page1';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import '@material-ui/core/styles';

const DRAWER_WIDTH = 240;

let useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	drawer: {
		width: DRAWER_WIDTH,
		flexShrink: 0,
	},
	drawerPaper: {
		width: DRAWER_WIDTH,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
}));

let App = function() {
	let classes = useStyles();
	let [ pageId, setPageId ] = useState(0);
	let [ state0, setState0 ] = useState(initialState0);
	let [ state1, setState1 ] = useState(initialState1);
	let page0 = { label: 'Simple chessboard', content: () => <Page0 state={state0} setState={setState0} /> };
	let page1 = { label: 'Interactive chessboard', content: () => <Page1 state={state1} setState={setState1} /> };
	let pages = [ page0, page1 ];
	let pageButtons = pages.map((page, index) => {
		return pageId === index ?
			<ListItem key={index}><ListItemText primary={page.label} /></ListItem> :
			<ListItem key={index} button onClick={() => setPageId(index)}><ListItemText primary={page.label} /></ListItem>;
	});
	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<Typography variant="h5" noWrap>
						KokopuReact demo
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }}>
				<Toolbar />
				<List>
					{pageButtons}
				</List>
			</Drawer>
			<main className={classes.content}>
				<Toolbar />
				{pages[pageId].content()}
			</main>
		</div>
	);
}

const appAnchor = document.createElement('div');
document.body.appendChild(appAnchor);

ReactDOM.render(<App />, appAnchor);
