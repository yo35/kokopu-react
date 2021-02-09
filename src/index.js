
import React from 'react';
import ReactDOM from 'react-dom';

import './chessboard.css';
import Board from './board';

const myElement = document.createElement('div');
document.body.appendChild(myElement);

ReactDOM.render(<Board />, myElement);
