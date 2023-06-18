Kokopu-React version 3.0.0 introduces some breaking changes with regard to the previous versions.
Those changes may require some fixes or adjustments in your codebase when upgrading Kokopu-React
from 2.x to 3.0.0 (or any subsequent version).

To upgrade from an older version, follow the [migration guide to 2.x](#/Migrate%20to%202.x) beforehand.



Methods `Chessboard.size(..)`
-----------------------------

As of 3.0.0, the method arguments `squareSize`, `coordinateVisible` and `smallScreenLimits`
must be passed as named arguments, as in the following example:

```plain
const squareSize = 42;
const coordinateVisible = true;
const smallScreenLimits = [ /* whatever */ ];

const { width, height } = Chessboard.size({
  squareSize: squareSize,
  coordinateVisible: coordinateVisible,
  smallScreenLimits: smallScreenLimits,
});

// Used to be, before 3.0.0:
// const { width, height } = Chessboard.size(squareSize, coordinateVisible, smallScreenLimits);
```



Methods `Chessboard.adaptSquareSize(..)`
----------------------------------------

As of 3.0.0, the method arguments `coordinateVisible` and `smallScreenLimits`
must be passed as named arguments, as in the following example:

```plain
const width = 600;
const height = 400;
const coordinateVisible = true;
const smallScreenLimits = [ /* whatever */ ];

const squareSize = Chessboard.adaptSquareSize(width, height, {
  coordinateVisible: coordinateVisible,
  smallScreenLimits: smallScreenLimits,
});

// Used to be, before 3.0.0:
// const squareSize = Chessboard.adaptSquareSize(width, height, coordinateVisible, smallScreenLimits);
```
