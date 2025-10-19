Kokopu-React
============

<img align="right" width="96" height="96" src="graphics/logo.svg" />

Kokopu-React is a [React](https://reactjs.org/)-based library to create and display chessboard and chess-related components.
Kokopu-React is built on top of [Kokopu](https://www.npmjs.com/package/kokopu), a headless library that
implements all the chess logic (game rules, parsing of [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)
and [PGN](https://en.wikipedia.org/wiki/Portable_Game_Notation) formats...).

[![NPM Version](https://img.shields.io/npm/v/kokopu-react)](https://www.npmjs.com/package/kokopu-react)
[![NPM Last Update](https://img.shields.io/npm/last-update/kokopu-react)](https://github.com/yo35/kokopu-react/actions/workflows/publish.yml)
[![NPM Downloads](https://img.shields.io/npm/dw/kokopu-react)](https://www.npmjs.com/package/kokopu-react)
[![Build Status](https://github.com/yo35/kokopu-react/actions/workflows/main.yml/badge.svg)](https://github.com/yo35/kokopu-react/actions/workflows/main.yml)
[![Coverage Status](https://coveralls.io/repos/github/yo35/kokopu-react/badge.svg?branch=master)](https://coveralls.io/github/yo35/kokopu-react?branch=master)



Documentation & live-demo
-------------------------

https://kokopu-react.yo35.org/



Installation
------------

```
npm install kokopu-react
```

If you use [Webpack](https://webpack.js.org/), please look at [webpack configuration](https://kokopu-react.yo35.org/docs/current/#/Webpack%20configuration)
to get more information on how to configure it to handle Kokopu-React properly.



Example
-------

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Chessboard } from 'kokopu-react';

createRoot(document.body).render(<Chessboard />);
```

![Chessboard component](test/graphic_references/05_chessboard_graphic/base/default.png)

More examples available in [documentation & live-demo](https://kokopu-react.yo35.org/).
