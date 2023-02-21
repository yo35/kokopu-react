Kokopu-React version 2.0.0 introduces some breaking changes with regard to the previous versions.
Those changes may require some fixes or adjustments in your codebase when upgrading Kokopu-React
from 1.x to 2.0.0 (or any subsequent version).



PropTypes
---------

As of 2.0.0, `Chessboard.propTypes`, `Movetext.propTypes`, etc... are no longer available, as component parameter type validation
is ensured through TypeScript. If your codebase includes references to the `propTypes` property of any Kokopu-React component,
you must remove those references.



SquareSize parameters
---------------------

Before 2.0.0, it was possible to define the square size of the `Chessboard` components through a string, i.e. for instance to write
things such as `<Chessboard squareSize="32" />`. As of 2.0.0, a strict type-checking policy is enforced to avoid unexpected type
conversions leading to hard-to-debug behaviors. As a consequence, the value passed to the square size parameter must be a number,
i.e. for instance:

```plain
<Chessboard squareSize={32} />
```
