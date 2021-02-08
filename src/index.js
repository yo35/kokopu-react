
import React from 'react';
import ReactDOM from 'react-dom';

import Square from './square';

const myElement = document.createElement('div');
document.body.appendChild(myElement);

ReactDOM.render(<Square value="TODO" />, myElement);
