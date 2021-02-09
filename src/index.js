
import React from 'react';
import ReactDOM from 'react-dom';

import './chessboard.css';
import Square from './square';

const myElement = document.createElement('div');
document.body.appendChild(myElement);

ReactDOM.render(<Square value="TODO" />, myElement);
