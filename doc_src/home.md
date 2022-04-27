Kokopu-React is a [React](https://reactjs.org/)-based library to create and display chessboard components.
Kokopu-React is built on top of [Kokopu](https://www.npmjs.com/package/kokopu), a headless library that
implements all the chess logic (game rules, parsing of [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)
and [PGN](https://en.wikipedia.org/wiki/Portable_Game_Notation) formats...).

https://www.npmjs.com/package/kokopu-react



Installation
------------

```plain
npm install kokopu-react
```



Main components
---------------

- [Chessboard](#/Components/Chessboard): SVG image representing a chessboard diagram. Optionally, the user may interact with the board
(move pieces, click on squares...). Annotations such as square markers or arrows can also be added to the board.
- [Movetext](#/Components/Movetext): represents a chess game, i.e. the headers (name of the players, event, etc.), the moves,
and all the related annotations if any (comments, variations, NAGs...).



Example
-------

```js
<Chessboard position="rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2" />
```
