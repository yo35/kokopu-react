```js
const pgn = `
[Event "Television Exhibition"]
[Site "London ENG"]
[Date "2014.01.23"]
[Round "?"]
[White "Bill Gates"]
[Black "Magnus Carlsen"]
[Result "0-1"]

1.e4 Nc6 2.Nf3 d5 3.Bd3 Nf6 4.exd5 Qxd5 5.Nc3 Qh5 6.O-O Bg4
7.h3 Ne5 8.hxg4 Nfxg4 9.Nxe5 Qh2# 0-1`;

<NavigationBoard game={pgn} initialNodeId="end" playButtonVisible />
```
